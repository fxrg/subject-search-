import {
    createSession,
    exportSessionJson,
    getActiveSessionCode,
    getSession,
    readSessionFile,
    saveSession,
    setActiveSessionCode,
    validateSession
} from './study-storage.js?v=2.4';
import {
    applyAutoDirection,
    detectDirection,
    detectLanguage,
    normalizeBullets,
    parseMarkdownCourse,
    shuffleArray
} from './md-parser.js?v=2.4';

const $ = selector => document.querySelector(selector);
const STATUS = [
    { key: 'not-started', icon: '⚪', label: 'لم يُذاكر', className: 'status-not-started' },
    { key: 'review', icon: '🟡', label: 'يحتاج مراجعة', className: 'status-review' },
    { key: 'first-pass', icon: '🔵', label: 'مذاكرة أولى', className: 'status-first-pass' },
    { key: 'mastered', icon: '🟢', label: 'متقن', className: 'status-mastered' }
];
const state = { session: null, modules: [], activeModuleId: '', filter: 'all', quiz: null };
const colleges = window.STUDY_PLANS?.colleges || {};
const courseBundles = {
    computing: window.REAL_COMPUTING_COURSES || {},
    health: window.REAL_HEALTH_COURSES || {},
    business: window.REAL_BUSINESS_COURSES || {},
    theoretical: window.REAL_THEORETICAL_COURSES || {}
};

const option = (value, label) => {
    const element = document.createElement('option');
    element.value = value;
    element.textContent = label;
    return element;
};
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const statusFor = value => STATUS[Math.max(0, Math.min(3, Number(value) || 0))];
const statusValue = id => Number(state.session?.topicStates?.[id] ?? state.session?.lessonStates?.[id] ?? 0);
const setStatus = (id, value) => {
    if (!state.session) return;
    const numeric = Math.max(0, Math.min(3, Number(value) || 0));
    state.session.topicStates ||= {};
    state.session.lessonStates ||= {};
    state.session.topicStates[id] = numeric;
    state.session.lessonStates[id] = numeric;
};

export function showToast(message, durationMs = 4000) {
    let container = $('#studyToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'studyToastContainer';
        container.className = 'study-toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.append(container);
    }
    const toast = document.createElement('div');
    toast.className = 'study-toast';
    toast.textContent = message;
    container.append(toast);

    const fadeDelay = Math.max(500, durationMs - 350);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 360);
    }, fadeDelay);
}

function getCollege() { return colleges[$('#collegeSelect')?.value] || {}; }
function getMajors() { return Object.entries(getCollege().majors || {}); }
function getCourses() {
    const selectedMajor = getMajors().find(([id]) => id === $('#majorSelect')?.value);
    const majorName = selectedMajor?.[1]?.nameAr;
    const byCode = new Map(Object.values(selectedMajor?.[1]?.levels || {}).flat().map(course => [course.code, { code: course.code, title: course.nameAr, major: majorName }]));
    Object.values(courseBundles[$('#collegeSelect')?.value] || {}).forEach(course => {
        if (!byCode.has(course.code) && (!majorName || course.major === majorName)) byCode.set(course.code, course);
    });
    return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}
function populateColleges() {
    const select = $('#collegeSelect');
    if (!select) return;
    select.replaceChildren(...Object.entries(colleges).map(([id, college]) => option(id, college.nameAr)));
    select.value = Object.keys(colleges)[0] || '';
    populateMajors();
}
function populateMajors() {
    const select = $('#majorSelect');
    if (!select) return;
    select.replaceChildren(...getMajors().map(([id, major]) => option(id, major.nameAr)));
    populateCourses();
}
function populateCourses(preferredCode = '') {
    const select = $('#courseSelect');
    if (!select) return;
    const courses = getCourses();
    select.replaceChildren(...courses.map(course => option(course.code, `${course.code} — ${course.title}`)));
    if (preferredCode && courses.some(course => course.code === preferredCode)) select.value = preferredCode;
}
function metadataFromControls() {
    const major = getMajors().find(([id]) => id === $('#majorSelect')?.value);
    const course = getCourses().find(item => item.code === $('#courseSelect')?.value);
    return {
        collegeId: $('#collegeSelect')?.value || 'computing',
        collegeName: getCollege().nameAr || '',
        majorId: $('#majorSelect')?.value || '',
        majorName: major?.[1]?.nameAr || '',
        courseCode: course?.code || '',
        courseName: course?.title || ''
    };
}

function ensureSession() {
    if (state.session) return;
    state.session = createSession(metadataFromControls());
    state.session.lessonStates ||= {};
    state.session.topicStates ||= {};
}

async function persist() {
    ensureSession();
    state.session.modules = state.modules;
    state.session.selectedModuleId = state.activeModuleId;
    state.session = await saveSession(state.session);
    await setActiveSessionCode(state.session.code);
    renderDashboard();
    renderUploadedFileCard();
}

function parseCourse(markdown) {
    const parsed = parseMarkdownCourse(markdown);
    state.modules = parsed.modules;
    if (state.session) {
        state.session.topics = parsed.topics;
        state.session.modules = parsed.modules;
    }
}

async function loadSession(session) {
    state.session = validateSession(session);
    const rawMarkdown = (state.session.markdown || '').trim()
        || (Array.isArray(state.session.modules) && state.session.modules.length
            ? state.session.modules.map(m => m.content || '').filter(Boolean).join('\n\n')
            : '');

    if (rawMarkdown) {
        state.session.markdown = rawMarkdown;
        parseCourse(rawMarkdown);
    } else if (Array.isArray(state.session.modules) && state.session.modules.length) {
        state.modules = state.session.modules;
    } else {
        state.modules = [];
    }

    const savedModuleExists = state.modules.some(m => m.id === state.session.selectedModuleId);
    state.activeModuleId = savedModuleExists ? state.session.selectedModuleId : '';
    state.quiz = null;

    const metadata = state.session.metadata || {};
    if (metadata.collegeId && colleges[metadata.collegeId]) {
        $('#collegeSelect').value = metadata.collegeId;
        populateMajors();
    }
    if (metadata.majorId) {
        $('#majorSelect').value = metadata.majorId;
        populateCourses(metadata.courseCode);
    }
    if (metadata.courseCode) {
        $('#courseSelect').value = metadata.courseCode;
    }

    state.session.lessonStates ||= {};
    state.session.topicStates ||= {};
    state.session.modules = state.modules;
    await saveSession(state.session);
    await setActiveSessionCode(state.session.code);
    renderAll();
}

function renderUploadedFileCard() {
    const card = $('#uploadedFileCard');
    if (!card) return;
    const hasLoadedFile = state.modules.length > 0 || Boolean((state.session?.markdown || '').trim());
    if (!hasLoadedFile) {
        card.hidden = true;
        return;
    }
    const displayFileName = (state.session?.fileName || '').trim()
        || `${state.session?.metadata?.courseCode || 'Course'} - Slides.md`;
    card.hidden = false;
    const nameEl = $('#uploadedFileName');
    const countEl = $('#uploadedFileModuleCount');
    if (nameEl) nameEl.textContent = displayFileName;
    if (countEl) countEl.textContent = `${state.modules.length} وحدة`;
}

async function removeUploadedFile() {
    if (!window.confirm('هل تريد حذف الملف المرفوع والبدء من جديد؟')) return;
    ensureSession();
    state.session.markdown = '';
    state.session.fileName = '';
    state.session.modules = [];
    state.session.topics = [];
    state.session.topicStates = {};
    state.session.lessonStates = {};
    state.session.selectedModuleId = '';
    state.session.selectedLessonId = '';
    state.modules = [];
    state.activeModuleId = '';
    state.quiz = null;
    const fileInput = $('#markdownFile');
    if (fileInput) fileInput.value = '';
    renderAll();
    await persist();
    showToast('🗑️ تم إزالة الملف');
}

function fallbackMarkdownToHtml(markdown) {
    const normalized = normalizeBullets(markdown || '');
    const lines = normalized.split('\n');
    const html = [];
    let inUl = false;
    let inOl = false;
    let inCode = false;
    let codeBuffer = [];

    const closeLists = () => {
        if (inUl) { html.push('</ul>'); inUl = false; }
        if (inOl) { html.push('</ol>'); inOl = false; }
    };

    lines.forEach(line => {
        if (/^\s*```/.test(line)) {
            closeLists();
            if (!inCode) {
                inCode = true;
                codeBuffer = [];
            } else {
                html.push(`<pre dir="ltr"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
                inCode = false;
            }
            return;
        }
        if (inCode) {
            codeBuffer.push(line);
            return;
        }
        const trimmed = line.trim();
        if (!trimmed) {
            closeLists();
            return;
        }
        const bullet = /^-\s+(.+)$/.exec(trimmed);
        if (bullet) {
            if (inOl) { html.push('</ol>'); inOl = false; }
            if (!inUl) { html.push('<ul dir="auto">'); inUl = true; }
            html.push(`<li dir="auto">${escapeHtml(bullet[1].replace(/^(\d+)\\\.\s+/, '$1. '))}</li>`);
            return;
        }
        const numbered = /^\d+[.)]\s+(.+)$/.exec(trimmed);
        if (numbered) {
            if (inUl) { html.push('</ul>'); inUl = false; }
            if (!inOl) { html.push('<ol dir="auto">'); inOl = true; }
            html.push(`<li dir="auto">${escapeHtml(numbered[1])}</li>`);
            return;
        }
        closeLists();
        const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
        if (heading) {
            const level = Math.min(6, heading[1].length + 1);
            html.push(`<h${level} dir="auto">${escapeHtml(heading[2])}</h${level}>`);
            return;
        }
        html.push(`<p dir="auto">${escapeHtml(trimmed)}</p>`);
    });

    closeLists();
    if (inCode && codeBuffer.length) {
        html.push(`<pre dir="ltr"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
    }
    return html.join('\n');
}

function markdownHtml(markdown) {
    const prepared = normalizeBullets(markdown || '');
    if (window.marked && typeof window.marked.parse === 'function') {
        try {
            const html = window.marked.parse(prepared, { gfm: true, breaks: true });
            return window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
        } catch (err) {
            console.warn('Marked fallback used:', err);
        }
    }
    return fallbackMarkdownToHtml(prepared);
}

function renderMarkdown(root, markdown) {
    if (!root) return;
    root.innerHTML = markdownHtml(markdown);
    applyAutoDirection(root);
    if (window.hljs) {
        root.querySelectorAll('pre code').forEach(block => {
            try { window.hljs.highlightElement(block); } catch (_) { /* ignore */ }
        });
    }
    if (window.renderMathInElement) {
        try {
            window.renderMathInElement(root, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ]
            });
        } catch (_) { /* ignore */ }
    }
}

function moduleLessons(module) {
    return module?.lessons || [];
}

function isVisible(item) {
    if (state.filter === 'all') return true;
    if (state.filter === 'review') return statusValue(item.id) === 1;
    if (state.filter === 'incomplete') return statusValue(item.id) < 3;
    return statusValue(item.id) === 3;
}

function statusSelect(id) {
    const select = document.createElement('select');
    select.className = `status-select ${statusFor(statusValue(id)).className}`;
    select.setAttribute('aria-label', 'حالة التقدم');
    STATUS.forEach((status, index) => select.append(option(index, `${status.icon} ${status.label}`)));
    select.value = String(statusValue(id));
    select.addEventListener('click', event => event.stopPropagation());
    select.addEventListener('change', event => {
        event.stopPropagation();
        setStatus(id, select.value);
        renderAll();
        persist();
    });
    return select;
}

export function openModule(moduleId, lessonId = '') {
    const target = state.modules.find(item => item.id === moduleId);
    if (!target) return;
    state.activeModuleId = target.id;
    state.quiz = null;
    if (state.session) {
        state.session.selectedModuleId = target.id;
        state.session.selectedLessonId = lessonId || target.lessons?.[0]?.id || '';
    }
    document.querySelectorAll('.workspace-panel').forEach(panel => {
        if (panel.id === 'readerPanel') panel.classList.add('mobile-active');
    });
    renderAll();
    persist();

    if (lessonId) {
        const lessonEl = document.getElementById(lessonId);
        if (lessonEl) {
            lessonEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
    }
    $('#readerPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeFocusedModule() {
    state.activeModuleId = '';
    state.quiz = null;
    if (state.session) {
        state.session.selectedModuleId = '';
    }
    renderAll();
    persist();
}

function renderIndex() {
    const list = $('#topicList');
    if (!list) return;
    list.replaceChildren();
    const query = ($('#topicSearch')?.value || '').trim().toLowerCase();

    state.modules.forEach(module => {
        const moduleMatchesQuery = !query || module.title.toLowerCase().includes(query);
        const lessons = moduleLessons(module).filter(lesson => (
            isVisible(lesson) && (moduleMatchesQuery || lesson.title.toLowerCase().includes(query) || lesson.content.toLowerCase().includes(query))
        ));
        if (!isVisible(module) && !lessons.length) return;
        if (query && !moduleMatchesQuery && !lessons.length) return;

        const block = document.createElement('div');
        block.className = 'index-module';

        const headerBtn = document.createElement('button');
        headerBtn.type = 'button';
        headerBtn.className = `index-module-title ${module.id === state.activeModuleId ? 'active' : ''}`;
        headerBtn.innerHTML = `<span dir="auto" style="unicode-bidi:plaintext;text-align:start">${escapeHtml(module.title)}</span><small>${moduleLessons(module).length} دروس</small>`;
        headerBtn.addEventListener('click', () => openModule(module.id));
        block.append(headerBtn);

        lessons.forEach(lesson => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = `topic-item ${lesson.id === state.session?.selectedLessonId && module.id === state.activeModuleId ? 'active' : ''} ${statusFor(statusValue(lesson.id)).className}`;
            item.innerHTML = `<span class="topic-status-icon">${statusFor(statusValue(lesson.id)).icon}</span> <span dir="auto" style="unicode-bidi:plaintext">${escapeHtml(lesson.title)}</span>`;
            item.addEventListener('click', () => openModule(module.id, lesson.id));
            block.append(item);
        });

        list.append(block);
    });

    const totalLessonsCount = state.modules.reduce((sum, mod) => sum + moduleLessons(mod).length, 0);
    $('#topicCount').textContent = `${state.modules.length} وحدة • ${totalLessonsCount} درس`;
    if (!list.children.length) {
        list.innerHTML = state.modules.length
            ? '<div class="empty-state" style="min-height:180px"><div><i class="fas fa-filter-circle-xmark"></i><p>لا توجد نتائج لهذا الفلتر.</p></div></div>'
            : '<div class="empty-state" style="min-height:180px"><div><i class="fas fa-list-check"></i><p>سيظهر الفهرس بعد رفع ملف Markdown</p></div></div>';
    }
}

function progressStats() {
    const lessonItems = state.modules.flatMap(module => moduleLessons(module));
    const items = lessonItems.length ? lessonItems : state.modules;
    const total = items.length;
    const points = items.reduce((sum, item) => sum + statusValue(item.id), 0);
    return {
        total,
        progress: total ? Math.round((points / (total * 3)) * 100) : 0,
        mastered: items.filter(item => statusValue(item.id) === 3).length,
        review: items.filter(item => statusValue(item.id) === 1).length,
        remaining: items.filter(item => statusValue(item.id) < 3).length
    };
}

function renderDashboard() {
    const stats = progressStats();
    const percent = `${stats.progress}%`;
    $('#progressPercent').textContent = percent;
    $('#progressBar').style.width = percent;
    $('#progressRing').style.setProperty('--progress', percent);
    $('#completedCount').textContent = stats.mastered;
    $('#reviewCount').textContent = stats.review;
    $('#remainingCount').textContent = stats.remaining;
    $('#goalPercent').textContent = `${goalProgress()}%`;
    $('#progressLabel').textContent = state.modules.length
        ? `${state.session?.metadata?.courseCode || 'المادة'} • ${state.modules.length} وحدات • ${stats.progress}% من مساحة الدراسة`
        : 'ارفع ملف Markdown للبدء';
    $('#sessionCodeBadge').textContent = state.session?.code || '—';
    $('#breadcrumb').textContent = [state.session?.metadata?.collegeName, state.session?.metadata?.majorName, state.session?.metadata?.courseCode].filter(Boolean).join('  ›  ') || 'اختر مادة دراسية';
}

function goalProgress() {
    const goals = state.session?.goals || [];
    return goals.length ? Math.round((goals.filter(goal => goal.done).length / goals.length) * 100) : 0;
}

function renderModuleCards() {
    const container = $('#moduleCards');
    if (!container) return;
    container.replaceChildren();

    const activeModule = state.modules.find(item => item.id === state.activeModuleId);
    if (!state.modules.length || activeModule || state.quiz) {
        container.hidden = true;
        return;
    }
    container.hidden = false;

    const visible = state.modules.filter(module => isVisible(module) || moduleLessons(module).some(isVisible));
    visible.forEach((module, idx) => {
        const lessons = moduleLessons(module);
        const mastered = lessons.filter(lesson => statusValue(lesson.id) === 3).length;
        const pct = lessons.length ? Math.round((mastered / lessons.length) * 100) : (statusValue(module.id) === 3 ? 100 : 0);
        const titleDir = detectDirection(module.title);

        const card = document.createElement('article');
        card.className = `module-card ${statusFor(statusValue(module.id)).className}`;
        card.dataset.moduleId = module.id;
        card.innerHTML = `
            <div class="module-card-top">
                <span class="module-eyebrow">MODULE ${idx + 1} OF ${state.modules.length}</span>
                <span class="module-status"></span>
            </div>
            <h3 dir="${titleDir}" style="unicode-bidi:plaintext;text-align:${titleDir === 'ltr' ? 'left' : 'right'};direction:${titleDir === 'ltr' ? 'ltr' : 'rtl'}">${escapeHtml(module.title)}</h3>
            <div class="module-meta">
                <span><i class="fas fa-layer-group"></i> ${lessons.length} دروس</span>
                <span>${mastered}/${lessons.length || 1} متقن</span>
            </div>
            <div class="module-progress"><span style="width:${pct}%"></span></div>
            <div class="module-actions">
                <button type="button" class="study-btn primary open-module" data-open-module="${escapeHtml(module.id)}">افتح الوحدة</button>
                <button type="button" class="study-btn quiz-module" data-quiz-module="${escapeHtml(module.id)}"><i class="fas fa-bolt"></i> اختبر نفسك</button>
            </div>
        `;
        card.querySelector('.module-status').append(statusSelect(module.id));
        card.addEventListener('click', event => {
            if (!event.target.closest('select, .quiz-module')) {
                openModule(module.id);
            }
        });
        card.querySelector('.open-module').addEventListener('click', event => {
            event.stopPropagation();
            openModule(module.id);
        });
        card.querySelector('.quiz-module').addEventListener('click', event => {
            event.stopPropagation();
            startQuiz(module);
        });
        container.append(card);
    });

    if (!container.children.length) {
        container.innerHTML = '<div class="empty-state"><div><i class="fas fa-layer-group"></i><p>لا توجد وحدات مطابقة لهذا الفلتر.</p></div></div>';
    }
}

function getModuleLang(module) {
    if (!module) return 'en';
    if (module.lang === 'en' || module.lang === 'ar') return module.lang;
    return detectLanguage(`${module.title || ''}\n${module.content || ''}`);
}

function renderReader() {
    const module = state.modules.find(item => item.id === state.activeModuleId);
    const content = $('#readerContent');
    const switcher = $('#activeModuleSwitcher');
    if (!content) return;

    if (switcher) {
        if (state.modules.length) {
            switcher.hidden = false;
            switcher.replaceChildren(
                option('', `كل الوحدات (${state.modules.length})`),
                ...state.modules.map(item => option(item.id, item.title))
            );
            switcher.value = module ? module.id : '';
        } else {
            switcher.hidden = true;
            switcher.replaceChildren();
        }
    }

    const readerTitle = $('#readerTitle');
    if (readerTitle) {
        const isQuizEn = state.quiz && state.quiz.lang === 'en';
        readerTitle.textContent = state.quiz
            ? (isQuizEn ? `Quiz: ${state.quiz.module.title}` : `اختبار: ${state.quiz.module.title}`)
            : (module ? module.title : (state.modules.length ? `جميع الوحدات الدراسية (${state.modules.length})` : 'قارئ السلايدات'));
        const headerDir = detectDirection(readerTitle.textContent);
        readerTitle.dir = headerDir;
        readerTitle.style.unicodeBidi = 'plaintext';
    }

    $('#flagReaderButton').hidden = !module || Boolean(state.quiz);

    if (!state.modules.length) {
        content.hidden = false;
        content.innerHTML = '<div class="empty-state"><div><i class="fas fa-book-open"></i><p>اختر مادة وارفع ملف Markdown لتبدأ جلسة دراسة.</p></div></div>';
        return;
    }

    if (state.quiz) {
        content.hidden = false;
        renderQuiz(content);
        return;
    }

    if (!module) {
        content.hidden = true;
        content.replaceChildren();
        return;
    }

    content.hidden = false;
    const index = state.modules.indexOf(module);
    const lessons = moduleLessons(module);
    const modLang = getModuleLang(module);
    const isModEn = modLang === 'en';
    const quizQuestions = [...(module.quizCandidates || []), ...(state.session?.quizzes?.[module.id] || [])];

    content.innerHTML = `
        <div class="focused-module-toolbar">
            <button type="button" class="study-btn back-to-modules" id="backToModules">← العودة لجميع الوحدات</button>
            <div class="focused-module-controls">
                <span class="focused-status-label">حالة الوحدة:</span>
                <span id="focusedModuleStatusMount"></span>
                <button type="button" class="study-btn primary" id="topModuleQuiz"><i class="fas fa-bolt"></i> اختبر نفسك (${quizQuestions.length || 1} MCQ)</button>
            </div>
        </div>
        <div class="lesson-stack">
            ${lessons.map((lesson, lessonIdx) => {
                const isLtrTitle = detectDirection(lesson.title) === 'ltr';
                const dirAttr = isLtrTitle ? 'ltr' : 'auto';
                const alignStyle = isLtrTitle ? 'text-align: left; direction: ltr; unicode-bidi: plaintext;' : 'unicode-bidi: plaintext;';
                return `
                <section class="lesson-card ${statusFor(statusValue(lesson.id)).className}" id="${escapeHtml(lesson.id)}">
                    <div class="lesson-header" dir="${dirAttr}">
                        <div style="${alignStyle}">
                            <span class="module-eyebrow">SECTION ${lessonIdx + 1} OF ${lessons.length}</span>
                            <h3 dir="${dirAttr}" style="${alignStyle}">${escapeHtml(lesson.title)}</h3>
                        </div>
                        <div class="lesson-controls"></div>
                    </div>
                    <div class="lesson-body" dir="ltr" style="unicode-bidi:plaintext"></div>
                </section>
                `;
            }).join('')}
        </div>
        <section class="study-card inline-quiz-preview" id="inlineQuizPreview" dir="${isModEn ? 'ltr' : 'rtl'}">
            <div class="lesson-header" dir="${isModEn ? 'ltr' : 'rtl'}">
                <div style="${isModEn ? 'text-align:left;direction:ltr' : ''}">
                    <span class="module-eyebrow">4-OPTION MULTIPLE CHOICE • AUTO-GENERATED</span>
                    <h3>${isModEn ? `Interactive Module Quiz (${quizQuestions.length || 1} Questions)` : `اختبار الاختيار من متعدد للوحدة (${quizQuestions.length || 1} سؤال)`}</h3>
                </div>
                <button type="button" class="study-btn primary" id="launchFullQuizBtn"><i class="fas fa-play"></i> ${isModEn ? 'Start MCQ Quiz' : 'ابدأ الاختبار التفاعلي'}</button>
            </div>
        </section>
        <div class="reader-nav">
            <button type="button" class="study-btn" id="previousModule">→ الوحدة السابقة</button>
            <button type="button" class="study-btn primary" id="moduleQuiz"><i class="fas fa-bolt"></i> اختبر نفسك</button>
            <button type="button" class="study-btn" id="nextModule">الوحدة التالية ←</button>
        </div>
    `;

    $('#focusedModuleStatusMount')?.append(statusSelect(module.id));
    $('#backToModules')?.addEventListener('click', closeFocusedModule);
    $('#topModuleQuiz')?.addEventListener('click', () => startQuiz(module));
    $('#launchFullQuizBtn')?.addEventListener('click', () => startQuiz(module));
    $('#moduleQuiz')?.addEventListener('click', () => startQuiz(module));

    lessons.forEach(lesson => {
        const card = document.getElementById(lesson.id);
        if (!card) return;
        card.querySelector('.lesson-controls')?.append(statusSelect(lesson.id));
        renderMarkdown(card.querySelector('.lesson-body'), lesson.content);
    });

    const prevBtn = $('#previousModule');
    const nextBtn = $('#nextModule');
    if (prevBtn) {
        prevBtn.disabled = index <= 0;
        prevBtn.addEventListener('click', () => {
            if (index > 0) openModule(state.modules[index - 1].id);
        });
    }
    if (nextBtn) {
        nextBtn.disabled = index >= state.modules.length - 1;
        nextBtn.addEventListener('click', () => {
            if (index < state.modules.length - 1) openModule(state.modules[index + 1].id);
        });
    }
}

function renderGoals() {
    const goals = state.session?.goals || [];
    $('#goalBar').style.width = `${goalProgress()}%`;
    $('#goalList').replaceChildren(...goals.map(goal => {
        const item = document.createElement('div');
        item.className = `goal-item ${goal.done ? 'done' : ''}`;
        item.innerHTML = `<input type="checkbox" ${goal.done ? 'checked' : ''}><div class="goal-text">${escapeHtml(goal.text)}${goal.date ? `<span class="goal-date">${escapeHtml(goal.date)}</span>` : ''}</div><button type="button" class="icon-btn" title="حذف"><i class="fas fa-trash"></i></button>`;
        item.querySelector('input').addEventListener('change', event => { goal.done = event.target.checked; renderAll(); persist(); });
        item.querySelector('.icon-btn').addEventListener('click', () => { state.session.goals = goals.filter(candidate => candidate.id !== goal.id); renderAll(); persist(); });
        return item;
    }));
}

function renderMistakes() {
    $('#mistakeList').replaceChildren(...[...(state.session?.mistakes || [])].sort((a, b) => b.count - a.count).map(mistake => {
        const item = document.createElement('div');
        item.className = 'mistake-item';
        item.innerHTML = `<span class="mistake-count">${mistake.count}</span><div class="mistake-text" dir="auto" style="unicode-bidi:plaintext">${escapeHtml(mistake.text)}</div><button type="button" class="study-btn">+1</button><button type="button" class="icon-btn" title="حذف"><i class="fas fa-trash"></i></button>`;
        item.querySelector('.study-btn').addEventListener('click', () => { mistake.count += 1; renderAll(); persist(); });
        item.querySelector('.icon-btn').addEventListener('click', () => { state.session.mistakes = state.session.mistakes.filter(candidate => candidate.id !== mistake.id); renderAll(); persist(); });
        return item;
    }));
}

function prepareMcqQuestions(module, lang) {
    const isEn = lang === 'en';
    const custom = state.session?.quizzes?.[module.id] || [];
    const rawList = [...(module.quizCandidates || []), ...custom];

    const poolAnswers = [
        ...rawList.map(q => q.answer).filter(Boolean),
        ...rawList.flatMap(q => q.distractors || []).filter(Boolean)
    ];

    const fallbackPool = isEn
        ? [
            'Eliminating all network communication protocols to prevent external data transmission entirely',
            'Granting unrestricted administrative privileges to all standard user accounts by default',
            'Storing plaintext credentials in public repositories to simplify system recovery procedures',
            'Disabling operating system audit logs to maximize CPU throughput and minimize disk usage'
        ]
        : [
            'إلغاء جميع ضوابط التحقق من الهوية للسماح بالوصول المفتوح لكافة المستخدمين دون قيود',
            'تخزين البيانات الحساسة بصيغة نصية غير مشفرة لتسريع عمليات النسخ الاحتياطي فقط',
            'إيقاف سجلات التدقيق والمراقبة بشكل كامل لتقليل استهلاك موارد النظام',
            'تجاهل تحديثات الأمان الدورية والاعتماد فقط على جدار الحماية المبدئي'
        ];

    if (!rawList.length) {
        const defaultAnswer = isEn
            ? `Core concepts and principles covered in ${module.title}`
            : `المفاهيم والمبادئ الأساسية المشروحة في ${module.title}`;
        return [{
            id: 'fallback-mcq-1',
            type: 'mcq',
            lang,
            question: isEn
                ? `Which of the following is the primary focus of "${module.title}"?`
                : `ما المحور الأساسي الذي تركز عليه «${module.title}»؟`,
            answer: defaultAnswer,
            distractors: fallbackPool.slice(0, 3),
            options: shuffleArray([defaultAnswer, ...fallbackPool.slice(0, 3)])
        }];
    }

    return rawList.map((item, idx) => {
        const answer = String(item.answer || '').trim();
        let distractors = Array.isArray(item.distractors) ? item.distractors.filter(d => d && d !== answer) : [];
        if (distractors.length < 3) {
            for (const candidate of [...poolAnswers, ...fallbackPool]) {
                if (distractors.length >= 3) break;
                if (candidate && candidate.toLowerCase() !== answer.toLowerCase() && !distractors.some(d => d.toLowerCase() === candidate.toLowerCase())) {
                    distractors.push(candidate);
                }
            }
        }
        distractors = distractors.slice(0, 3);
        return {
            id: item.id || `mcq-${idx + 1}`,
            type: 'mcq',
            lang,
            question: item.question,
            answer,
            distractors,
            options: shuffleArray([answer, ...distractors])
        };
    });
}

function startQuiz(module) {
    state.activeModuleId = module.id;
    const lang = getModuleLang(module);
    const questions = prepareMcqQuestions(module, lang);
    state.quiz = {
        module,
        lang,
        questions,
        index: 0,
        score: 0,
        selectedOption: null,
        misses: []
    };
    renderAll();
}

function renderQuiz(root) {
    const quiz = state.quiz;
    const isEn = quiz.lang === 'en';
    const dir = isEn ? 'ltr' : 'rtl';
    const question = quiz.questions[quiz.index];
    const done = quiz.index >= quiz.questions.length;

    const topNav = `
        <div class="focused-module-toolbar">
            <button type="button" class="study-btn" id="backToModuleReader">${isEn ? '← Back to Module' : '← العودة لشرح الوحدة'}</button>
            <button type="button" class="study-btn" id="backToAllModulesFromQuiz">${isEn ? 'All Modules' : 'جميع الوحدات'}</button>
        </div>
    `;

    if (done) {
        const total = quiz.questions.length;
        const pct = total ? Math.round((quiz.score / total) * 100) : 0;
        const belowThreshold = pct < 70;
        const alreadyFlagged = statusValue(quiz.module.id) === 1;

        root.innerHTML = `
            ${topNav}
            <div class="quiz-result" dir="${dir}">
                <div class="quiz-score-header">
                    <i class="fas ${belowThreshold ? 'fa-chart-pie' : 'fa-trophy'}"></i>
                    <h3>${isEn ? `Score: ${quiz.score} / ${total} (${pct}%)` : `النتيجة: ${quiz.score} / ${total} (${pct}%)`}</h3>
                    <p>${belowThreshold
                        ? (isEn ? 'Score is below 70%. We recommend marking this module as "Needs Review (يحتاج مراجعة)".' : 'النتيجة أقل من 70%. ننصح بوضع هذه الوحدة على حالة «يحتاج مراجعة».')
                        : (isEn ? 'Great job! You demonstrated strong mastery of this module.' : 'ممتاز! أظهرت إتقاناً قوياً لمفاهيم هذه الوحدة.')}</p>
                </div>

                ${belowThreshold ? `
                    <div class="quiz-review-prompt">
                        <span>${isEn ? '⚠️ Flag this module as "يحتاج مراجعة (Needs Review)"?' : '⚠️ هل ترغب بتصنيف هذه الوحدة كـ «يحتاج مراجعة»؟'}</span>
                        <button type="button" class="study-btn" id="flagModuleReviewBtn" ${alreadyFlagged ? 'disabled' : ''}>
                            ${alreadyFlagged
                                ? (isEn ? '🟡 Already Flagged as يحتاج مراجعة' : '🟡 تم التصنيف كـ يحتاج مراجعة')
                                : (isEn ? '🟡 Flag as يحتاج مراجعة (Needs Review)' : '🟡 تحديد كـ يحتاج مراجعة')}
                        </button>
                    </div>
                ` : ''}

                ${quiz.misses.length ? `
                    <div class="quiz-missed-list">
                        <strong>${isEn ? `Missed Questions (${quiz.misses.length}):` : `الأسئلة الخاطئة (${quiz.misses.length}):`}</strong>
                        ${quiz.misses.map((miss, mIdx) => `
                            <div class="quiz-missed-item">
                                <div class="missed-q">${mIdx + 1}. ${escapeHtml(miss.question)}</div>
                                <div class="missed-wrong">✗ ${isEn ? 'Your Answer:' : 'إجابتك:'} ${escapeHtml(miss.chosen)}</div>
                                <div class="missed-right">✓ ${isEn ? 'Correct Answer:' : 'الإجابة الصحيحة:'} ${escapeHtml(miss.answer)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="quiz-actions">
                    <button type="button" class="study-btn primary" id="retryQuiz"><i class="fas fa-rotate-right"></i> ${isEn ? 'Retry Quiz' : 'إعادة الاختبار'}</button>
                    ${quiz.misses.length ? `<button type="button" class="study-btn" id="addQuizMistakes"><i class="fas fa-flag"></i> ${isEn ? 'إضافة الأسئلة الخاطئة لسجل الأخطاء (Add Missed to Mistakes Log)' : 'إضافة الأسئلة الخاطئة لسجل الأخطاء'}</button>` : ''}
                    <button type="button" class="study-btn" id="finishQuizToModule">${isEn ? 'Back to Module' : 'العودة للوحدة'}</button>
                </div>
            </div>
            ${customQuizForm(isEn)}
        `;

        $('#backToModuleReader')?.addEventListener('click', () => { state.quiz = null; renderAll(); });
        $('#finishQuizToModule')?.addEventListener('click', () => { state.quiz = null; renderAll(); });
        $('#backToAllModulesFromQuiz')?.addEventListener('click', closeFocusedModule);
        $('#retryQuiz')?.addEventListener('click', () => startQuiz(quiz.module));
        $('#flagModuleReviewBtn')?.addEventListener('click', () => {
            setStatus(quiz.module.id, 1);
            renderAll();
            persist();
            showToast(isEn ? '🟡 Module flagged as "يحتاج مراجعة"' : '🟡 تم تصنيف الوحدة كـ «يحتاج مراجعة»');
        });
        $('#addQuizMistakes')?.addEventListener('click', () => {
            ensureSession();
            quiz.misses.forEach(miss => {
                const entryText = `${miss.question} → ${miss.answer}`;
                const existing = state.session.mistakes.find(item => item.text.toLowerCase() === entryText.toLowerCase());
                if (existing) existing.count += 1;
                else state.session.mistakes.push({ id: crypto.randomUUID(), text: entryText, count: 1 });
            });
            renderAll();
            persist();
            showToast(isEn ? '🚩 Missed questions added to Mistakes Log' : '🚩 تمت إضافة الأسئلة الخاطئة لسجل الأخطاء');
        });
        wireCustomQuizForm(quiz.module, isEn);
        return;
    }

    const locked = quiz.selectedOption !== null;
    const chosenText = locked ? question.options[quiz.selectedOption] : null;
    const isCorrect = locked && chosenText === question.answer;
    const letters = ['A', 'B', 'C', 'D'];

    root.innerHTML = `
        ${topNav}
        <div class="quiz-progress" dir="${dir}">
            <span>${isEn ? `Question ${quiz.index + 1} of ${quiz.questions.length}` : `سؤال ${quiz.index + 1} من ${quiz.questions.length}`}</span>
            <span>${isEn ? `Score: ${quiz.score} / ${quiz.index + (locked ? 1 : 0)}` : `النتيجة: ${quiz.score} / ${quiz.index + (locked ? 1 : 0)}`}</span>
        </div>
        <div class="quiz-question" dir="${dir}">
            <span class="module-eyebrow">${isEn ? 'MULTIPLE CHOICE • SELECT ONE OPTION' : 'اختيار من متعدد • اختر إجابة واحدة'}</span>
            <h3 dir="${dir}" style="unicode-bidi:plaintext">${escapeHtml(question.question)}</h3>
            <div class="mcq-options-grid">
                ${question.options.map((optText, optIdx) => {
                    let stateClass = '';
                    if (locked) {
                        if (optText === question.answer) stateClass = 'option-correct';
                        else if (optIdx === quiz.selectedOption) stateClass = 'option-wrong';
                    }
                    return `
                        <button type="button" class="mcq-option ${stateClass}" data-option-index="${optIdx}" ${locked ? 'disabled' : ''} dir="${dir}">
                            <span class="mcq-badge">${letters[optIdx] || optIdx + 1}</span>
                            <span class="mcq-text" dir="auto">${escapeHtml(optText)}</span>
                        </button>
                    `;
                }).join('')}
            </div>
            ${locked ? `
                <div class="mcq-feedback-bar ${isCorrect ? 'is-correct' : 'is-wrong'}" dir="${dir}">
                    <span>${isCorrect
                        ? (isEn ? '✅ Correct!' : '✅ إجابة صحيحة!')
                        : (isEn ? '❌ Incorrect — Review this concept' : '❌ إجابة خاطئة — راجع هذا المفهوم')}</span>
                    <button type="button" class="study-btn primary" id="nextQuizQuestionBtn">
                        ${quiz.index + 1 < quiz.questions.length
                            ? (isEn ? 'Next Question →' : 'السؤال التالي ←')
                            : (isEn ? 'View Score Summary →' : 'عرض النتيجة النهائية ←')}
                    </button>
                </div>
            ` : ''}
        </div>
        ${customQuizForm(isEn)}
    `;

    $('#backToModuleReader')?.addEventListener('click', () => { state.quiz = null; renderAll(); });
    $('#backToAllModulesFromQuiz')?.addEventListener('click', closeFocusedModule);

    root.querySelectorAll('.mcq-option').forEach(button => {
        button.addEventListener('click', () => {
            if (quiz.selectedOption !== null) return;
            const pickedIdx = Number(button.dataset.optionIndex);
            quiz.selectedOption = pickedIdx;
            const pickedText = question.options[pickedIdx];
            if (pickedText === question.answer) {
                quiz.score += 1;
            } else {
                quiz.misses.push({
                    question: question.question,
                    chosen: pickedText,
                    answer: question.answer
                });
            }
            renderAll();
        });
    });

    $('#nextQuizQuestionBtn')?.addEventListener('click', () => {
        quiz.index += 1;
        quiz.selectedOption = null;
        renderAll();
    });

    wireCustomQuizForm(quiz.module, isEn);
}

function customQuizForm(isEn = false) {
    return isEn
        ? '<form class="custom-quiz-form" id="customQuizForm" dir="ltr" style="text-align:left"><strong>Add a Custom MCQ Question to this Module</strong><input id="customQuestion" required placeholder="Question stem"><input id="customAnswer" required placeholder="Correct answer (3 distractors will be auto-generated)"><button class="study-btn" type="submit"><i class="fas fa-plus"></i> Save Custom Question</button></form>'
        : '<form class="custom-quiz-form" id="customQuizForm"><strong>إضافة سؤال مخصص للوحدة</strong><input id="customQuestion" required placeholder="السؤال"><input id="customAnswer" required placeholder="الإجابة الصحيحة (سيتم توليد 3 خيارات إضافية تلقائياً)"><button class="study-btn" type="submit"><i class="fas fa-plus"></i> حفظ للسؤال القادم</button></form>';
}

function wireCustomQuizForm(module, isEn = false) {
    $('#customQuizForm')?.addEventListener('submit', event => {
        event.preventDefault();
        state.session.quizzes ||= {};
        state.session.quizzes[module.id] ||= [];
        state.session.quizzes[module.id].push({
            id: `custom-${crypto.randomUUID()}`,
            type: 'mcq',
            lang: getModuleLang(module),
            question: $('#customQuestion').value.trim(),
            answer: $('#customAnswer').value.trim(),
            source: 'custom'
        });
        event.target.reset();
        persist();
        showToast(isEn ? '✅ Custom question saved to module quiz' : '✅ تم حفظ السؤال في جلسة المذاكرة');
    });
}

function renderAll() {
    renderIndex();
    renderModuleCards();
    renderReader();
    renderGoals();
    renderMistakes();
    renderDashboard();
    renderUploadedFileCard();
}

async function importSession(file) {
    if (!file) return;
    if (/\.(md|markdown|txt)$/i.test(file.name)) {
        await importMarkdown(file);
        return;
    }
    try {
        const session = await readSessionFile(file);
        if (!session.fileName) session.fileName = file.name;
        await loadSession(session);
        showToast(`✅ تم رفع الملف بنجاح — تم استخراج ${state.modules.length} وحدة دراسية`);
    } catch (error) {
        alert(error.message);
    }
}

async function importMarkdown(file) {
    if (!file || !/\.(md|markdown|txt)$/i.test(file.name)) {
        alert('اختر ملف Markdown بصيغة .md');
        return;
    }
    ensureSession();
    state.session.fileName = file.name;
    state.session.markdown = await file.text();
    parseCourse(state.session.markdown);
    state.activeModuleId = '';
    state.quiz = null;
    state.session.selectedModuleId = '';
    state.session.selectedLessonId = '';
    state.session.topicStates = {};
    state.session.lessonStates = {};
    renderAll();
    await persist();
    showToast(`✅ تم رفع الملف بنجاح — تم استخراج ${state.modules.length} وحدة دراسية`);
}

function newSessionFromControls() {
    state.session = createSession(metadataFromControls());
    state.session.lessonStates = {};
    state.session.topicStates = {};
    state.modules = [];
    state.activeModuleId = '';
    state.quiz = null;
    const fileInput = $('#markdownFile');
    if (fileInput) fileInput.value = '';
    renderAll();
    persist();
}

function applyTheme() {
    const theme = localStorage.getItem('pmaru_theme') || 'dark';
    document.documentElement.classList.toggle('light-mode', theme === 'light');
    document.body.classList.toggle('light-mode', theme === 'light');
    document.documentElement.dataset.theme = theme;
    const icon = $('[data-theme-toggle-icon]');
    if (icon) icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function wireEvents() {
    $('#collegeSelect')?.addEventListener('change', () => { populateMajors(); newSessionFromControls(); });
    $('#majorSelect')?.addEventListener('change', () => { populateCourses(); newSessionFromControls(); });
    $('#courseSelect')?.addEventListener('change', newSessionFromControls);
    $('#markdownFile')?.addEventListener('change', event => {
        if (event.target.files?.[0]) {
            importMarkdown(event.target.files[0]);
            event.target.value = '';
        }
    });
    $('#removeUploadedFileBtn')?.addEventListener('click', removeUploadedFile);
    $('#topicSearch')?.addEventListener('input', renderIndex);
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
        state.filter = button.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
        renderAll();
    }));
    $('#activeModuleSwitcher')?.addEventListener('change', event => {
        const value = event.target.value;
        if (!value) closeFocusedModule();
        else openModule(value);
    });
    $('#importButton')?.addEventListener('click', () => $('#importFile')?.click());
    $('#importFile')?.addEventListener('change', event => {
        if (event.target.files?.[0]) {
            importSession(event.target.files[0]);
            event.target.value = '';
        }
    });
    $('#restoreCodeButton')?.addEventListener('click', async () => {
        const session = await getSession($('#sessionCodeInput')?.value);
        if (!session) {
            alert('لم نعثر على جلسة بهذا الرمز على هذا الجهاز. يمكنك تحميل ملف JSON.');
        } else {
            await loadSession(session);
            showToast(`✅ تم رفع الملف بنجاح — تم استخراج ${state.modules.length} وحدة دراسية`);
        }
    });
    $('#exportButton')?.addEventListener('click', () => state.session && exportSessionJson(state.session));
    $('#copySessionButton')?.addEventListener('click', () => state.session && navigator.clipboard.writeText(state.session.code));
    $('#newSessionButton')?.addEventListener('click', newSessionFromControls);
    $('#goalForm')?.addEventListener('submit', event => {
        event.preventDefault();
        ensureSession();
        state.session.goals.push({ id: crypto.randomUUID(), text: $('#goalText').value.trim(), date: $('#goalDate').value, done: false });
        event.target.reset();
        renderAll();
        persist();
    });
    $('#mistakeForm')?.addEventListener('submit', event => {
        event.preventDefault();
        ensureSession();
        const text = $('#mistakeText').value.trim();
        const existing = state.session.mistakes.find(item => item.text.toLowerCase() === text.toLowerCase());
        if (existing) existing.count += 1;
        else state.session.mistakes.push({ id: crypto.randomUUID(), text, count: 1 });
        event.target.reset();
        renderAll();
        persist();
    });
    $('#flagReaderButton')?.addEventListener('click', () => {
        const module = state.modules.find(item => item.id === state.activeModuleId);
        if (module) {
            state.session.mistakes.push({ id: crypto.randomUUID(), text: module.title, count: 1 });
            renderAll();
            persist();
        }
    });
    $('#dropZone')?.addEventListener('click', () => $('#importFile')?.click());
    $('#dropZone')?.addEventListener('dragover', event => { event.preventDefault(); event.currentTarget.classList.add('dragover'); });
    $('#dropZone')?.addEventListener('dragleave', event => event.currentTarget.classList.remove('dragover'));
    $('#dropZone')?.addEventListener('drop', event => {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        if (event.dataTransfer?.files?.[0]) importSession(event.dataTransfer.files[0]);
    });
    document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(button.dataset.copy);
        const text = button.textContent;
        button.textContent = 'تم النسخ';
        setTimeout(() => { button.textContent = text; }, 1200);
    }));
    document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('.workspace-panel').forEach(panel => panel.classList.toggle('mobile-active', panel.id === button.dataset.tab));
    }));
    $('[data-theme-button]')?.addEventListener('click', () => {
        localStorage.setItem('pmaru_theme', document.documentElement.classList.contains('light-mode') ? 'dark' : 'light');
        applyTheme();
    });
    $('[data-mobile-menu]')?.addEventListener('click', () => $('#pmaruMobileDrawer')?.classList.toggle('open'));
}

async function clearStaleServiceWorkerCache() {
    try {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.update().catch(() => {})));
        }
    } catch (_) {
        // Ignore service worker update errors
    }
}

async function init() {
    await clearStaleServiceWorkerCache();
    populateColleges();
    wireEvents();
    applyTheme();
    const activeCode = await getActiveSessionCode();
    const saved = activeCode ? await getSession(activeCode) : null;
    if (saved) {
        await loadSession(saved);
    } else {
        ensureSession();
        renderAll();
        await persist();
    }
}

init().catch(error => {
    console.error(error);
    alert('تعذر تهيئة مساحة المذاكرة المحلية.');
});
