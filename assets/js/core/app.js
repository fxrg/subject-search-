/**
 * Subject Search 2.0 - Core Application Orchestrator
 * Bootstraps all academic engines, connects the UI, and registers PWA services.
 */

import { CONFIG } from './config.js';
import { idbStorage } from '../cache/indexeddb.js';
import { courseService } from '../services/course-service.js';
import { calendarService } from '../services/calendar-service.js';
import { searchEngine } from '../search/search-engine.js';
import { plannerEngine } from '../planner/planner-engine.js';
import { PrerequisiteGraph } from '../courses/prerequisite-graph.js';
import { courseComparison } from '../courses/course-comparison.js';
import { reviewSystem } from '../community/reviews.js';
import { personalLibrary } from '../community/library.js';
import { AcademicAssistant } from '../assistant/academic-assistant.js';

class SubjectSearchApp {
    constructor() {
        this.currentTab = 'search';
        this.prereqGraph = null;
    }

    async init() {
        console.log(`[SubjectSearch 2.0] Initializing version ${CONFIG.VERSION}...`);

        // Register Service Worker for PWA & offline support
        this.registerServiceWorker();

        // Initialize background data engines in parallel
        await Promise.all([
            courseService.init(),
            calendarService.init(),
            plannerEngine.init(),
            reviewSystem.init(),
            personalLibrary.init()
        ]);

        console.log('[SubjectSearch 2.0] All core data services initialized.');

        // Bind global UI events
        this.bindEvents();
        this.updateHeroCountdowns();
        this.renderTrendingSearches();
        this.renderInitialCourses();
        this.renderPlannerView();
        this.renderCalendarView();

        // Listen for online/offline status
        this.setupConnectivityMonitor();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
                .catch(err => console.debug('[PWA] Service Worker registration skipped or failed:', err));
        }
    }

    setupConnectivityMonitor() {
        const updateStatus = () => {
            const banner = document.getElementById('offlineNoticeBanner');
            if (banner) {
                banner.classList.toggle('hidden', navigator.onLine);
            }
        };
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('[data-ss-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = btn.getAttribute('data-ss-tab');
                this.switchTab(targetTab);
            });
        });

        // Search Input with debouncing
        const searchInput = document.getElementById('smartSearchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.executeSearch(e.target.value);
                }, 250);
            });
        }

        // Filter dropdowns
        ['filterCollege', 'filterMajor', 'filterLevel', 'filterDifficulty'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => {
                    const searchVal = document.getElementById('smartSearchInput')?.value || '';
                    this.executeSearch(searchVal);
                });
            }
        });
    }

    switchTab(tabId) {
        this.currentTab = tabId;

        // Update active tab buttons
        document.querySelectorAll('[data-ss-tab]').forEach(btn => {
            const isActive = btn.getAttribute('data-ss-tab') === tabId;
            btn.classList.toggle('active-nav-tab', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('text-gray-400', !isActive);
        });

        // Hide all tab panes, show target pane
        document.querySelectorAll('.ss-tab-pane').forEach(pane => {
            pane.classList.add('hidden');
        });

        const activePane = document.getElementById(`tab-pane-${tabId}`);
        if (activePane) {
            activePane.classList.remove('hidden');
        }

        // Lazy initialize views
        if (tabId === 'prereq-graph') {
            const container = document.getElementById('prereqGraphContainer');
            if (container) {
                this.prereqGraph = new PrerequisiteGraph(container);
                this.prereqGraph.render();
            }
        } else if (tabId === 'compare') {
            this.renderCompareView();
        } else if (tabId === 'planner') {
            this.renderPlannerView();
        } else if (tabId === 'calendar') {
            this.renderCalendarView();
        }
    }

    updateHeroCountdowns() {
        const summary = calendarService.getCountdownSummary();
        const finalsBadge = document.getElementById('heroFinalsCountdown');
        const regBadge = document.getElementById('heroRegistrationCountdown');

        if (finalsBadge && summary.finals?.countdown) {
            const days = summary.finals.countdown.days;
            finalsBadge.innerHTML = `<span class="font-extrabold text-amber-400 text-lg md:text-xl">${days}</span> يوم على الفاينل`;
        }

        if (regBadge && summary.registration?.countdown) {
            const days = summary.registration.countdown.days;
            regBadge.innerHTML = `<span class="font-extrabold text-emerald-400 text-lg md:text-xl">${days}</span> يوم للتسجيل`;
        }
    }

    renderTrendingSearches() {
        const trendingContainer = document.getElementById('trendingChipsContainer');
        if (!trendingContainer) return;

        const trendings = [
            { label: 'ذكاء اصطناعي', query: 'ذكاء اصطناعي' },
            { label: 'CS 230 (OOP)', query: 'CS 230' },
            { label: 'قواعد بيانات', query: 'قواعد بيانات' },
            { label: 'LAW 101 (قانون)', query: 'LAW 101' },
            { label: 'هياكل بيانات', query: 'Data Structure' },
            { label: 'إعلام رقمي', query: 'MED 101' },
            { label: 'إحصاء تطبيقي', query: 'STAT 101' }
        ];

        trendingContainer.innerHTML = trendings.map(t => `
            <button class="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-gray-300 hover:text-white transition"
                    onclick="window.app2?.applyQuickSearch('${t.query}')">
                <i class="fa-solid fa-arrow-trend-up text-[10px] text-indigo-400 ml-1"></i>
                ${t.label}
            </button>
        `).join('');
    }

    applyQuickSearch(term) {
        const input = document.getElementById('smartSearchInput');
        if (input) {
            input.value = term;
            this.executeSearch(term);
            this.switchTab('search');
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    executeSearch(query) {
        const college = document.getElementById('filterCollege')?.value || '';
        const level = document.getElementById('filterLevel')?.value || '';
        const difficulty = document.getElementById('filterDifficulty')?.value || '';

        const results = searchEngine.search(query, {
            college,
            level,
            difficulty
        });

        const container = document.getElementById('searchResultsGrid');
        const countBadge = document.getElementById('searchResultsCount');

        if (countBadge) {
            countBadge.textContent = `${results.length} مقرر`;
        }

        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16 text-gray-400">
                    <i class="fa-solid fa-magnifying-glass text-5xl mb-4 text-indigo-400/40"></i>
                    <h3 class="text-lg font-bold text-white mb-1">لم يتم العثور على نتائج مطابقة</h3>
                    <p class="text-sm">جرب البحث بكلمات بديلة أو استخدم المرادفات كـ (ذكاء اصطناعي، برمجة، قانون، إحصاء)</p>
                </div>
            `;
            return;
        }

        container.innerHTML = results.map(r => this.createCourseCardHtml(r.course, r.matchType)).join('');
    }

    renderInitialCourses() {
        this.executeSearch('');
    }

    createCourseCardHtml(course, matchType = '') {
        const isBookmarked = personalLibrary.isSaved(course.code);
        return `
            <div class="glass-card rounded-2xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden group">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                            ${course.code}
                        </span>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-gray-400"><i class="fa-regular fa-clock ml-1"></i>${course.creditHours} ساعات</span>
                            <button onclick="window.app2?.toggleBookmark('${course.code}')" class="text-gray-400 hover:text-amber-400 transition" title="حفظ بالمكتبة">
                                <i class="${isBookmarked ? 'fa-solid text-amber-400' : 'fa-regular'} fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition">${course.nameAr}</h3>
                    <p class="text-xs text-indigo-300/70 mb-3">${course.nameEn || ''}</p>
                    <p class="text-sm text-gray-300 leading-relaxed line-clamp-2 mb-4">${course.description || ''}</p>
                </div>

                <div class="pt-4 border-t border-white/10">
                    <div class="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span><strong class="text-white">${course.collegeNameAr}</strong></span>
                        <span class="text-amber-400 font-semibold"><i class="fa-solid fa-star ml-1"></i>${course.rating || 4.5}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.app2?.addToComparison('${course.id}')" 
                                class="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-medium text-gray-200 transition text-center">
                            <i class="fa-solid fa-code-compare ml-1 text-indigo-400"></i> مقارنة
                        </button>
                        <button onclick="window.app2?.showCourseModal('${course.id}')" 
                                class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition text-center shadow-lg shadow-indigo-600/30">
                            التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    toggleBookmark(code) {
        if (personalLibrary.isSaved(code)) {
            personalLibrary.removeCourse(code);
        } else {
            personalLibrary.saveCourse(code);
        }
        const searchVal = document.getElementById('smartSearchInput')?.value || '';
        this.executeSearch(searchVal);
    }

    addToComparison(courseId) {
        const res = courseComparison.addCourse(courseId);
        if (res.success) {
            this.switchTab('compare');
        } else {
            alert(res.message);
        }
    }

    renderCompareView() {
        const container = document.getElementById('comparisonContainer');
        if (container) {
            container.innerHTML = courseComparison.renderComparisonTable();
            window.courseCompareInstance = {
                removeCourseAndRerender: (id) => {
                    courseComparison.removeCourse(id);
                    this.renderCompareView();
                }
            };
        }
    }

    renderPlannerView() {
        const progress = plannerEngine.getProgress();
        const progressBar = document.getElementById('plannerProgressBar');
        const progressText = document.getElementById('plannerProgressPercent');
        const creditsEarned = document.getElementById('plannerCreditsEarned');

        if (progressBar) progressBar.style.width = `${progress.percentage}%`;
        if (progressText) progressText.textContent = `${progress.percentage}%`;
        if (creditsEarned) creditsEarned.textContent = `${progress.earnedCredits} / ${progress.totalCreditsRequired} ساعة`;

        // Render Task List
        const taskContainer = document.getElementById('plannerTaskList');
        if (!taskContainer) return;

        const tasks = plannerEngine.getAllTasks();
        if (tasks.length === 0) {
            taskContainer.innerHTML = `
                <div class="text-center py-10 text-gray-400">
                    <i class="fa-solid fa-calendar-check text-4xl mb-3 text-indigo-400/40"></i>
                    <p class="mb-4">لا توجد مهام استذكار مجدولة حالياً</p>
                    <button onclick="window.app2?.generateSmartSchedule()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-95 transition">
                        <i class="fa-solid fa-wand-magic-sparkles ml-1"></i> توليد خطة استذكار ذكية للاختبارات
                    </button>
                </div>
            `;
            return;
        }

        taskContainer.innerHTML = tasks.slice(0, 8).map(t => `
            <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between transition hover:border-indigo-500/30">
                <div class="flex items-center gap-3">
                    <button onclick="window.app2?.toggleTask('${t.id}')" class="text-lg ${t.completed ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}">
                        <i class="fa-${t.completed ? 'solid fa-circle-check' : 'regular fa-circle'}"></i>
                    </button>
                    <div>
                        <div class="text-sm font-semibold ${t.completed ? 'line-through text-gray-500' : 'text-white'}">
                            ${t.courseCode} - ${t.topic}
                        </div>
                        <div class="text-xs text-gray-400 mt-0.5">
                            <i class="fa-regular fa-calendar ml-1"></i> ${t.date} • ${t.durationHours} ساعة
                        </div>
                    </div>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${t.type === 'exam_revision' ? 'bg-red-500/20 text-red-300' : 'bg-indigo-500/20 text-indigo-300'}">
                    ${t.type === 'exam_revision' ? 'مراجعة نهائية' : 'جلسة مذاكرة'}
                </span>
            </div>
        `).join('');
    }

    async generateSmartSchedule() {
        await plannerEngine.generateSmartSchedule();
        this.renderPlannerView();
    }

    async toggleTask(taskId) {
        await plannerEngine.toggleTaskCompletion(taskId);
        this.renderPlannerView();
    }

    renderCalendarView() {
        const container = document.getElementById('academicCalendarEventsList');
        if (!container) return;

        const events = calendarService.getEvents();
        container.innerHTML = events.map(e => {
            const isCompleted = e.status === 'completed';
            const isActive = e.status === 'active';
            let statusBadge = `<span class="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">قادم</span>`;
            if (isCompleted) {
                statusBadge = `<span class="px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-semibold">مكتمل</span>`;
            } else if (isActive) {
                statusBadge = `<span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold animate-pulse">جارٍ الآن</span>`;
            }

            return `
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-white/20">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-bold text-white text-base">${e.nameAr}</h4>
                            ${statusBadge}
                        </div>
                        <p class="text-xs text-indigo-300/80">${e.nameEn || ''}</p>
                    </div>
                    <div class="text-left sm:text-right text-xs text-gray-300 font-mono">
                        <i class="fa-regular fa-calendar ml-1 text-indigo-400"></i> ${e.startDate} ${e.endDate !== e.startDate ? `← ${e.endDate}` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    showCourseModal(courseId) {
        const course = courseService.getCourseById(courseId);
        if (!course) return;

        const modal = document.getElementById('courseDetailModal2');
        if (!modal) return;

        document.getElementById('modal2CourseTitle').textContent = `${course.code} - ${course.nameAr}`;
        document.getElementById('modal2CourseCollege').textContent = `${course.collegeNameAr} • المستوى ${course.level}`;
        document.getElementById('modal2CourseDesc').textContent = course.description || 'لا يوجد وصف متاح';
        document.getElementById('modal2CoursePrereqs').textContent = course.prerequisites?.length ? course.prerequisites.join(', ') : 'بدون متطلب سابق';
        document.getElementById('modal2CourseRating').textContent = `${course.rating}/5 (${course.reviewCount} تقييم)`;
        document.getElementById('modal2CourseWorkload').textContent = course.workload;

        modal.classList.remove('hidden');
    }

    closeCourseModal() {
        const modal = document.getElementById('courseDetailModal2');
        if (modal) modal.classList.add('hidden');
    }
}

// Instantiate and expose globally
export const app2 = new SubjectSearchApp();
window.app2 = app2;

// Auto-run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app2.init());
} else {
    app2.init();
}
