// ============================================================================
// Subject Search 2.0 — Core Platform Engine (PMARU)
// 100% Firebase Auth + Live Firestore Sync + Role Permissions (Edit: All Auth, Delete: Admin Only)
// + Contributor Attribution & Leaderboard Engine
// ============================================================================
(function () {
    'use strict';

    // Purge any legacy local-auth keys immediately (100% Firebase Auth only)
    try {
        localStorage.removeItem('courseApp_users');
        localStorage.removeItem('courseApp_currentUser');
    } catch (e) {}

    // 1. Theme Management (Dark Default + Crisp Light Mode)
    function applySavedTheme() {
        try {
            const saved = localStorage.getItem('pmaru_theme') || localStorage.getItem('theme') || 'dark';
            const isLight = saved === 'light';
            document.documentElement.classList.toggle('light-mode', isLight);
            if (document.body) document.body.classList.toggle('light-mode', isLight);
            document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
            updateThemeIcons(isLight);
        } catch (e) {}
    }

    function updateThemeIcons(isLight) {
        document.querySelectorAll('[data-theme-toggle-icon]').forEach(icon => {
            icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    window.toggleTheme = function () {
        const isCurrentlyLight = document.documentElement.classList.contains('light-mode');
        const nextTheme = isCurrentlyLight ? 'dark' : 'light';
        try {
            localStorage.setItem('pmaru_theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
        } catch (e) {}
        applySavedTheme();
    };

    applySavedTheme();
    document.addEventListener('DOMContentLoaded', applySavedTheme);

    // 2. Language Toggle (AR / EN)
    const I18N_DICT = {
        ar: {
            navHome: 'الرئيسية',
            navColleges: 'الكليات',
            navComputing: 'كلية الحوسبة والمعلوماتية',
            navBusiness: 'كلية العلوم الإدارية والمالية',
            navHealth: 'كلية العلوم الصحية',
            navTheoretical: 'كلية الدراسات النظرية',
            navAllColleges: 'دليل جميع الكليات',
            navPlanner: 'المخطط الأكاديمي',
            navPrereq: 'شجرة المتطلبات',
            navCompare: 'مقارنة المقررات',
            navLeaderboard: 'المتصدرون',
            btnAddCourse: 'إضافة مقرر جديد',
            univName: 'جامعة الأمير مساعد بن عبدالرحمن'
        },
        en: {
            navHome: 'Home',
            navColleges: 'Colleges',
            navComputing: 'Computing & Informatics',
            navBusiness: 'Administrative & Financial',
            navHealth: 'Health Sciences',
            navTheoretical: 'Theoretical Studies',
            navAllColleges: 'All Colleges Directory',
            navPlanner: 'Academic Planner',
            navPrereq: 'Prerequisite Tree',
            navCompare: 'Course Compare',
            navLeaderboard: 'Leaderboard',
            btnAddCourse: 'Add New Course',
            univName: 'Prince Musaid bin Abdulrahman University'
        }
    };

    window.toggleLanguage = function () {
        const currentLang = document.documentElement.lang === 'en' ? 'en' : 'ar';
        const nextLang = currentLang === 'ar' ? 'en' : 'ar';
        try {
            localStorage.setItem('pmaru_lang', nextLang);
        } catch (e) {}
        applyLanguage(nextLang);
    };

    function applyLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
        const dict = I18N_DICT[lang] || I18N_DICT.ar;
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (dict[key]) el.textContent = dict[key];
        });
        document.querySelectorAll('[data-lang-label]').forEach(el => {
            el.textContent = lang === 'ar' ? 'EN' : 'عربي';
        });
    }

    // 3. Mobile Drawer Toggle
    window.toggleMobileMenu = function () {
        const drawer = document.getElementById('pmaruMobileDrawer') || document.getElementById('mobile-menu');
        if (drawer) {
            drawer.classList.toggle('open');
            drawer.classList.toggle('hidden');
        }
    };

    // 4. Relative Path Resolver (Works from root, /page/*, /page/all-colleges/*/*, etc.)
    function getRootPrefix() {
        const path = (window.location.pathname || '').replace(/\\/g, '/');
        if (path.includes('/page/all-colleges/computing/') ||
            path.includes('/page/all-colleges/health/') ||
            path.includes('/page/all-colleges/business/') ||
            path.includes('/page/all-colleges/theoretical/') ||
            path.includes('/page/auth/Account/')) {
            return '../../../';
        }
        if (path.includes('/page/all-colleges/') ||
            path.includes('/page/planner/') ||
            path.includes('/page/prereq-graph/') ||
            path.includes('/page/compare/') ||
            path.includes('/page/GPA/') ||
            path.includes('/page/auth/') ||
            path.includes('/page/Blogs/')) {
            return '../../';
        }
        return '';
    }
    window.getPmaruRootPrefix = getRootPrefix;

    function resolveRootFile(fileName) {
        return getRootPrefix() + fileName;
    }

    function resolveRelativeAuthUrl(targetFile) {
        const file = targetFile || 'auth.html';
        return getRootPrefix() + 'page/auth/' + file;
    }

    // 5. College & Majors Registry (Strictly Scoped per College)
    const COLLEGE_REGISTRY = {
        computing: {
            id: 'computing',
            nameAr: 'كلية الحوسبة والمعلوماتية',
            majors: ['علوم الحاسب', 'تقنية المعلومات', 'علوم البيانات', 'المواد العامة']
        },
        theoretical: {
            id: 'theoretical',
            nameAr: 'كلية الدراسات النظرية',
            majors: ['القانون', 'الإعلام الرقمي', 'اللغات والترجمة', 'الإحصاء التطبيقي وتحليل البيانات']
        },
        business: {
            id: 'business',
            nameAr: 'كلية العلوم الإدارية والمالية',
            majors: ['المالية', 'المحاسبة', 'إدارة الأعمال', 'التجارة الإلكترونية']
        },
        health: {
            id: 'health',
            nameAr: 'كلية العلوم الصحية',
            majors: ['الصحة العامة', 'المعلوماتية الصحية']
        }
    };
    window.PMARU_COLLEGE_REGISTRY = COLLEGE_REGISTRY;

    function detectCurrentCollegeId() {
        if (document.body && document.body.dataset && document.body.dataset.college) {
            return document.body.dataset.college;
        }
        const container = document.querySelector('[data-college-add-container]');
        if (container) {
            return container.getAttribute('data-college-add-container') || 'computing';
        }
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('/computing')) return 'computing';
        if (path.includes('/theoretical')) return 'theoretical';
        if (path.includes('/business')) return 'business';
        if (path.includes('/health')) return 'health';
        return null;
    }

    // 6. Firebase Initialization, Admin Verification & Live Auth State
    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyCen8J6HuLOj3d1tpEA8aF13XVmGxiG9BY",
        authDomain: "seu-subjects.firebaseapp.com",
        projectId: "seu-subjects",
        storageBucket: "seu-subjects.firebasestorage.app",
        messagingSenderId: "552315681734",
        appId: "1:552315681734:web:d7ae70e54e7e2bf7b290c7",
        measurementId: "G-Y2FL6V8X3L"
    };

    const ADMIN_UID_WHITELIST = [
        'c3qEzVVU52NddP2LmNQXAldCZ5C2',
        'S41CLovzpAURxejUSkA4W52TNdn1'
    ];
    const ADMIN_EMAIL_WHITELIST = [
        'ds.turki.1@gmail.com',
        'bekrkraft6@gmail.com'
    ];

    window.currentPmaruUser = null;
    window.currentPmaruIsAdmin = false;

    window.isPmaruAdmin = function (user) {
        const u = user || window.currentPmaruUser;
        if (!u) return false;
        if (window.currentPmaruIsAdmin) return true;
        if (ADMIN_UID_WHITELIST.includes(u.uid)) return true;
        if (u.email && ADMIN_EMAIL_WHITELIST.includes(u.email.toLowerCase())) return true;
        return false;
    };

    async function checkFirestoreAdminDoc(user) {
        if (!user) {
            window.currentPmaruIsAdmin = false;
            return false;
        }
        if (ADMIN_UID_WHITELIST.includes(user.uid) ||
            (user.email && ADMIN_EMAIL_WHITELIST.includes(user.email.toLowerCase()))) {
            window.currentPmaruIsAdmin = true;
            return true;
        }
        if (!window.db) return false;
        try {
            const doc = await window.db.collection('admins').doc(user.uid).get();
            window.currentPmaruIsAdmin = Boolean(doc && doc.exists);
            return window.currentPmaruIsAdmin;
        } catch (e) {
            return false;
        }
    }

    function initFirebaseIfNeeded() {
        if (typeof firebase === 'undefined') return;
        try {
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            if (firebase.firestore) {
                window.db = firebase.firestore();
                window.coursesCollection = window.db.collection('userCourses');
            }
            if (firebase.auth) {
                window.auth = firebase.auth();
                window.auth.onAuthStateChanged(async (user) => {
                    window.currentPmaruUser = user || null;
                    await checkFirestoreAdminDoc(user);
                    updateAuthDependentUI(user);
                    injectCourseCardContributorsAndActions();
                    document.dispatchEvent(new CustomEvent('pmaru:auth-changed', {
                        detail: { user, isAdmin: window.isPmaruAdmin(user) }
                    }));
                });
            }
        } catch (e) {
            console.warn('Firebase init note:', e.message);
        }
    }

    // Ensure Leaderboard link & Mobile Drawer exist in Navbar across all pages
    function ensureLeaderboardNavItem() {
        const rootPrefix = getRootPrefix();
        const navLists = document.querySelectorAll('.pmaru-nav-links');
        const leaderboardUrl = resolveRootFile('leaderboard.html');
        const isCurrentLeaderboard = (window.location.pathname || '').toLowerCase().includes('leaderboard.html');

        navLists.forEach(ul => {
            if (ul.querySelector('a[href*="leaderboard.html"]')) return;
            const li = document.createElement('li');
            li.innerHTML = `<a href="${leaderboardUrl}" class="pmaru-nav-link ${isCurrentLeaderboard ? 'active' : ''}">
                <i class="fas fa-trophy" style="color:#F59E0B;"></i> <span data-i18n-key="navLeaderboard">المتصدرون</span>
            </a>`;
            ul.appendChild(li);
        });

        // Ensure every .pmaru-navbar has a #pmaruMobileDrawer for mobile navigation
        document.querySelectorAll('.pmaru-navbar').forEach(navbar => {
            if (!navbar.querySelector('#pmaruMobileDrawer')) {
                const drawer = document.createElement('div');
                drawer.id = 'pmaruMobileDrawer';
                drawer.className = 'pmaru-mobile-drawer';
                drawer.innerHTML = `
                    <div class="pmaru-mobile-grid">
                        <a href="${rootPrefix}index.html"><i class="fas fa-home" style="color:var(--accent-primary);"></i> الرئيسية</a>
                        <a href="${rootPrefix}page/all-colleges/computing/computing.html"><i class="fas fa-laptop-code" style="color:var(--accent-primary);"></i> كلية الحوسبة</a>
                        <a href="${rootPrefix}page/all-colleges/health/health.html"><i class="fas fa-heartbeat" style="color:var(--accent-emerald);"></i> العلوم الصحية</a>
                        <a href="${rootPrefix}page/all-colleges/business/business.html"><i class="fas fa-chart-line" style="color:var(--accent-amber);"></i> العلوم الإدارية</a>
                        <a href="${rootPrefix}page/all-colleges/theoretical/theoretical.html"><i class="fas fa-scale-balanced" style="color:var(--accent-indigo);"></i> الدراسات النظرية</a>
                        <a href="${rootPrefix}page/all-colleges/all-colleges.html"><i class="fas fa-th-large" style="color:var(--accent-primary);"></i> جميع الكليات</a>
                        <a href="${rootPrefix}page/planner/planner.html"><i class="fas fa-calendar-check" style="color:var(--accent-emerald);"></i> المخطط الأكاديمي</a>
                        <a href="${rootPrefix}page/prereq-graph/prereq-graph.html"><i class="fas fa-project-diagram" style="color:var(--accent-primary);"></i> شجرة المتطلبات</a>
                        <a href="${rootPrefix}page/compare/compare.html"><i class="fas fa-columns" style="color:var(--accent-amber);"></i> مقارنة المقررات</a>
                        <a href="${leaderboardUrl}"><i class="fas fa-trophy" style="color:#F59E0B;"></i> لوحة المتصدرين</a>
                        <a href="${rootPrefix}page/auth/auth.html"><i class="fas fa-user-shield" style="color:var(--accent-primary);"></i> حساب الطالب</a>
                    </div>
                `;
                navbar.appendChild(drawer);
            }
        });

        // Ensure .pmaru-nav-actions has a [data-nav-auth-btn] link on every page
        document.querySelectorAll('.pmaru-nav-actions').forEach(actionsEl => {
            const hasAuthLink = actionsEl.querySelector('a[href*="Account"], a[href*="auth.html"], a[href*="profile.html"], [data-nav-auth-btn]');
            if (!hasAuthLink) {
                const a = document.createElement('a');
                a.setAttribute('data-nav-auth-btn', '');
                a.href = resolveRelativeAuthUrl('auth.html');
                a.className = 'pmaru-btn-outline';
                actionsEl.insertBefore(a, actionsEl.firstChild);
            }
        });

        const mobileGrids = document.querySelectorAll('.pmaru-mobile-grid');
        mobileGrids.forEach(grid => {
            if (grid.querySelector('a[href*="leaderboard.html"]')) return;
            const a = document.createElement('a');
            a.href = leaderboardUrl;
            a.innerHTML = `<i class="fas fa-trophy" style="color:#F59E0B;"></i> لوحة المتصدرين`;
            grid.appendChild(a);
        });
    }

    function updateAuthDependentUI(user) {
        ensureLeaderboardNavItem();
        const authUrl = resolveRelativeAuthUrl('auth.html');
        const profileUrl = resolveRootFile('profile.html');
        const adminUrl = resolveRootFile('admin.html');
        const isAdmin = window.isPmaruAdmin(user);

        // 1. Update College Page Add-Course Containers
        document.querySelectorAll('[data-college-add-container]').forEach(container => {
            const collegeId = container.getAttribute('data-college-add-container') || detectCurrentCollegeId() || 'computing';
            const colInfo = COLLEGE_REGISTRY[collegeId] || COLLEGE_REGISTRY.computing;
            if (user) {
                const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'طالب موثق');
                container.innerHTML = `
                    <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.65rem;">
                        <button type="button" onclick="openAddCourseModal('${collegeId}')" class="pmaru-btn-primary" style="box-shadow:0 8px 22px rgba(14,165,233,0.28);">
                            <i class="fas fa-plus-circle"></i> <span>إضافة مقرر جديد في ${colInfo.nameAr}</span>
                        </button>
                        <a href="${profileUrl}" class="pmaru-badge" style="text-decoration:none; background:rgba(16,185,129,0.12); color:#10B981; border-color:rgba(16,185,129,0.3);">
                            <i class="fas fa-user-check"></i> ${displayName}
                        </a>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <a href="${authUrl}" class="pmaru-btn-outline" style="border-color:rgba(56,189,248,0.4); color:var(--accent-primary); background:rgba(14,165,233,0.08);">
                        <i class="fas fa-user-lock"></i> <span>سجل دخولك لإضافة مقرر أو مصدر</span>
                    </a>
                `;
            }
        });

        // 2. Update Top Navbar Profile Link & Admin Button
        const navActionsList = document.querySelectorAll('.pmaru-nav-actions');
        navActionsList.forEach(actionsEl => {
            // Admin Quick Link Pill (Shown ONLY for Admin)
            let adminBtn = actionsEl.querySelector('[data-nav-admin-btn]');
            if (isAdmin) {
                if (!adminBtn) {
                    adminBtn = document.createElement('a');
                    adminBtn.setAttribute('data-nav-admin-btn', 'true');
                    adminBtn.className = 'pmaru-btn-outline';
                    adminBtn.style.cssText = 'padding:0.45rem 0.85rem; font-size:0.8rem; border-color:rgba(244,63,94,0.45); color:#FB7185; background:rgba(244,63,94,0.1);';
                    actionsEl.insertBefore(adminBtn, actionsEl.firstChild);
                }
                adminBtn.href = adminUrl;
                adminBtn.innerHTML = `<i class="fas fa-shield-halved"></i> <span>لوحة الأدمن</span>`;
            } else if (adminBtn) {
                adminBtn.remove();
            }
        });

        document.querySelectorAll('.pmaru-nav-actions a[href*="Account"], .pmaru-nav-actions a[href*="auth.html"], .pmaru-nav-actions a[href*="profile.html"], [data-nav-auth-btn]').forEach(link => {
            if (user) {
                const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'البروفايل');
                link.href = profileUrl;
                link.title = `البروفايل الشخصي (${displayName})`;
                link.className = 'pmaru-btn-outline';
                link.style.cssText = 'padding:0.45rem 0.9rem; font-size:0.82rem; border-color:rgba(16,185,129,0.45); color:#10B981; background:rgba(16,185,129,0.08); text-decoration:none; display:inline-flex; align-items:center; gap:0.45rem;';
                link.innerHTML = `<i class="fas fa-user-check"></i> <span>${displayName}</span>`;
            } else {
                link.href = authUrl;
                link.title = 'تسجيل الدخول / إنشاء حساب';
                link.className = 'pmaru-btn-outline';
                link.style.cssText = 'padding:0.45rem 0.9rem; font-size:0.82rem; text-decoration:none; display:inline-flex; align-items:center; gap:0.45rem;';
                link.innerHTML = `<i class="fas fa-sign-in-alt" style="color:var(--accent-primary);"></i> <span>دخول</span>`;
            }
        });
    }

    initFirebaseIfNeeded();
    document.addEventListener('DOMContentLoaded', () => {
        ensureLeaderboardNavItem();
        updateAuthDependentUI(window.currentPmaruUser);
        setTimeout(injectCourseCardContributorsAndActions, 60);
    });

    // 7. Contributor Name Resolution & Card Badge Enhancer
    window.getCourseAuthorName = function (courseObj) {
        if (!courseObj) return 'مبادرة طلاب الكلية';
        if (courseObj.authorName && courseObj.authorName !== 'مستخدم مجهول') {
            return courseObj.authorName;
        }
        if (courseObj.addedBy) {
            if (typeof courseObj.addedBy === 'object' && courseObj.addedBy.name && courseObj.addedBy.name !== 'مستخدم مجهول') {
                return courseObj.addedBy.name;
            }
            if (typeof courseObj.addedBy === 'string' && courseObj.addedBy !== 'community' && courseObj.addedBy.length < 25) {
                return courseObj.addedBy;
            }
        }
        return 'مبادرة طلاب الكلية';
    };

    function injectCourseCardContributorsAndActions() {
        const isLogged = Boolean(window.currentPmaruUser);
        const isAdmin = window.isPmaruAdmin(window.currentPmaruUser);

        document.querySelectorAll('.course-card').forEach(card => {
            const codeEl = card.querySelector('.course-code');
            const code = (card.getAttribute('data-code') || (codeEl ? codeEl.textContent : '') || '').replace(/\s+/g, '').toUpperCase();
            if (!code) return;
            card.setAttribute('data-code', code);

            const course = window.findCourseByCode ? window.findCourseByCode(code) : null;
            const authorName = window.getCourseAuthorName(course);

            // 1. Inject or update Contributor Attribution Pill on the card
            let contribEl = card.querySelector('.pmaru-card-contributor');
            if (!contribEl) {
                contribEl = document.createElement('div');
                contribEl.className = 'pmaru-card-contributor';
                contribEl.style.cssText = 'margin-top:0.65rem; padding-top:0.55rem; border-top:1px dashed var(--border-subtle); display:flex; align-items:center; justify-content:space-between; gap:0.5rem; font-size:0.76rem; color:var(--text-secondary);';
                const topBlock = card.firstElementChild;
                if (topBlock) {
                    topBlock.appendChild(contribEl);
                }
            }

            const editBtnHtml = isLogged
                ? `<button type="button" onclick="event.stopPropagation(); openEditCourseModal('${code}')" class="pmaru-chip" style="padding:0.2rem 0.55rem; font-size:0.72rem; color:var(--accent-primary); border-color:rgba(14,165,233,0.35); cursor:pointer;" title="تعديل المقرر أو إضافة مصادر">
                       <i class="fas fa-pen"></i> تعديل
                   </button>`
                : '';

            const deleteBtnHtml = isAdmin
                ? `<button type="button" onclick="event.stopPropagation(); deleteCourseAsAdmin('${code}')" class="pmaru-chip" style="padding:0.2rem 0.55rem; font-size:0.72rem; color:#FB7185; border-color:rgba(244,63,94,0.4); background:rgba(244,63,94,0.1); cursor:pointer;" title="حذف المقرر (صلاحية أدمن فقط)">
                       <i class="fas fa-trash"></i> حذف
                   </button>`
                : '';

            contribEl.innerHTML = `
                <span style="display:inline-flex; align-items:center; gap:0.35rem;">
                    <i class="fas fa-user-pen" style="color:var(--accent-emerald);"></i>
                    <span>أضيفت بواسطة: <strong style="color:var(--text-primary);">${authorName}</strong></span>
                </span>
                <span style="display:inline-flex; align-items:center; gap:0.3rem;">
                    ${editBtnHtml}
                    ${deleteBtnHtml}
                </span>
            `;
        });
    }
    window.refreshPmaruCourseCards = injectCourseCardContributorsAndActions;

    // Observe DOM mutations on course grids so newly rendered cards automatically get contributor badges & role buttons
    document.addEventListener('DOMContentLoaded', () => {
        const grids = document.querySelectorAll('.courses-grid');
        grids.forEach(grid => {
            const obs = new MutationObserver(() => {
                injectCourseCardContributorsAndActions();
            });
            obs.observe(grid, { childList: true });
        });
    });

    // 8. Course Classification & Bundle Sync
    function classifyCourseCollege(cleanCode, courseObj) {
        const explicitCol = String(courseObj.collegeId || courseObj.college || '').toLowerCase();
        const major = String(courseObj.major || '');

        if (explicitCol === 'theoretical' || explicitCol.includes('نظرية') ||
            /^(LAW|MED|DM|TRN|LNG)/.test(cleanCode) ||
            COLLEGE_REGISTRY.theoretical.majors.includes(major)) {
            return 'theoretical';
        }
        if (explicitCol === 'business' || explicitCol.includes('إدارية') || explicitCol.includes('مالية') ||
            /^(MGT|ACCT|FIN|ECOM|ECON|MKT|MIS|BUS)/.test(cleanCode) ||
            COLLEGE_REGISTRY.business.majors.includes(major) ||
            major.includes('ادارة') || major.includes('إدارة') || major.includes('محاسبة')) {
            return 'business';
        }
        if (explicitCol === 'health' || explicitCol.includes('صحية') ||
            /^(HCI|PH|PHC|PHP|HCM|BIOL|HS)/.test(cleanCode) ||
            COLLEGE_REGISTRY.health.majors.includes(major) ||
            major.includes('صحية') || major.includes('صحة')) {
            return 'health';
        }
        return 'computing';
    }

    function mergeCourseIntoBundles(code, courseObj) {
        if (!code || !courseObj) return;
        const cleanCode = String(code).replace(/\s+/g, '').toUpperCase();
        if (cleanCode.includes(',') || cleanCode.length > 12 || cleanCode === 'WU2QJTV9SFVNVOQM17AG') return;

        // If marked deleted by Admin, remove from all bundles
        if (courseObj.status === 'deleted') {
            if (window.ALL_REAL_COURSES) delete window.ALL_REAL_COURSES[cleanCode];
            if (window.REAL_COMPUTING_COURSES) delete window.REAL_COMPUTING_COURSES[cleanCode];
            if (window.REAL_HEALTH_COURSES) delete window.REAL_HEALTH_COURSES[cleanCode];
            if (window.REAL_BUSINESS_COURSES) delete window.REAL_BUSINESS_COURSES[cleanCode];
            if (window.REAL_THEORETICAL_COURSES) delete window.REAL_THEORETICAL_COURSES[cleanCode];
            return;
        }

        window.ALL_REAL_COURSES = window.ALL_REAL_COURSES || {};
        window.REAL_COMPUTING_COURSES = window.REAL_COMPUTING_COURSES || {};
        window.REAL_HEALTH_COURSES = window.REAL_HEALTH_COURSES || {};
        window.REAL_BUSINESS_COURSES = window.REAL_BUSINESS_COURSES || {};
        window.REAL_THEORETICAL_COURSES = window.REAL_THEORETICAL_COURSES || {};

        const targetCollege = classifyCourseCollege(cleanCode, courseObj);
        const existing = window.ALL_REAL_COURSES[cleanCode] || {};
        const resolvedAuthor = courseObj.authorName || existing.authorName || window.getCourseAuthorName(courseObj);

        const merged = Object.assign({}, existing, courseObj, {
            code: cleanCode,
            authorName: resolvedAuthor,
            collegeId: targetCollege,
            college: COLLEGE_REGISTRY[targetCollege] ? COLLEGE_REGISTRY[targetCollege].nameAr : targetCollege
        });

        if (Array.isArray(existing.resources) || Array.isArray(courseObj.resources)) {
            const combined = Array.isArray(courseObj.resources) && courseObj.overwriteResources
                ? courseObj.resources
                : [].concat(existing.resources || [], courseObj.resources || []);
            const seen = new Set();
            merged.resources = combined.filter(r => {
                if (!r || (!r.link && !r.url)) return false;
                const linkUrl = r.link || r.url;
                if (seen.has(linkUrl)) return false;
                seen.add(linkUrl);
                return true;
            });
        }

        window.ALL_REAL_COURSES[cleanCode] = merged;

        if (targetCollege === 'health') {
            if (!COLLEGE_REGISTRY.health.majors.includes(merged.major)) {
                merged.major = (/^(PH|HCM101|MATH001)/.test(cleanCode) || String(merged.major || '').includes('عامة'))
                    ? 'الصحة العامة'
                    : 'المعلوماتية الصحية';
            }
            window.REAL_HEALTH_COURSES[cleanCode] = merged;
            delete window.REAL_COMPUTING_COURSES[cleanCode];
        } else if (targetCollege === 'business') {
            if (!COLLEGE_REGISTRY.business.majors.includes(merged.major)) {
                if (cleanCode.startsWith('FIN')) merged.major = 'المالية';
                else if (cleanCode.startsWith('ACCT')) merged.major = 'المحاسبة';
                else if (cleanCode.startsWith('ECOM')) merged.major = 'التجارة الإلكترونية';
                else merged.major = 'إدارة الأعمال';
            }
            window.REAL_BUSINESS_COURSES[cleanCode] = merged;
            delete window.REAL_COMPUTING_COURSES[cleanCode];
        } else if (targetCollege === 'theoretical') {
            window.REAL_THEORETICAL_COURSES[cleanCode] = merged;
            delete window.REAL_COMPUTING_COURSES[cleanCode];
        } else {
            window.REAL_COMPUTING_COURSES[cleanCode] = merged;
        }
    }

    function loadLocalCustomCourses() {
        try {
            if (window.REAL_COMPUTING_COURSES) {
                Object.keys(window.REAL_COMPUTING_COURSES).forEach(k => {
                    if (/^(MGT|ACCT|FIN|ECOM|ECON|MKT|MIS|BUS|LAW|MED|TRN)/.test(k)) {
                        delete window.REAL_COMPUTING_COURSES[k];
                    }
                });
            }
            const deletedCodes = JSON.parse(localStorage.getItem('pmaru_deleted_courses') || '[]');
            deletedCodes.forEach(c => mergeCourseIntoBundles(c, { status: 'deleted' }));

            const localStr = localStorage.getItem('pmaru_custom_courses');
            if (localStr) {
                const parsed = JSON.parse(localStr);
                Object.entries(parsed).forEach(([code, data]) => mergeCourseIntoBundles(code, data));
            }
        } catch (e) {}
    }

    async function syncLiveFirestoreCourses() {
        loadLocalCustomCourses();
        if (!window.db) return;
        try {
            const snap = await window.db.collection('userCourses').get();
            snap.forEach(doc => {
                const d = doc.data();
                const code = (d.code || doc.id || '').replace(/\s+/g, '').toUpperCase();
                if (code && !code.includes(',') && code.length <= 12 && code !== 'WU2QJTV9SFVNVOQM17AG') {
                    mergeCourseIntoBundles(code, {
                        code,
                        title: d.title || code,
                        desc: d.desc || d.description || '',
                        credits: Number(d.credits) || 3,
                        level: Number(d.level) || 3,
                        major: d.major || '',
                        college: d.college || '',
                        collegeId: d.collegeId || '',
                        resources: Array.isArray(d.resources) ? d.resources : [],
                        addedBy: d.addedBy || null,
                        authorName: d.authorName || (d.addedBy && d.addedBy.name) || '',
                        authorUid: d.authorUid || (typeof d.addedBy === 'string' ? d.addedBy : (d.addedBy && d.addedBy.id)) || '',
                        authorEmail: d.authorEmail || (d.addedBy && d.addedBy.email) || '',
                        status: d.status || 'active',
                        isUserAdded: true,
                        firestoreId: doc.id
                    });
                }
            });
            document.dispatchEvent(new CustomEvent('pmaru:courses-updated'));
            injectCourseCardContributorsAndActions();
        } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadLocalCustomCourses();
        syncLiveFirestoreCourses();
    });

    // 9. Study Plans & Course Lookup Helpers
    window.getNormalizedColleges = function () {
        const sp = window.STUDY_PLANS;
        if (!sp || !sp.colleges) return [];
        const rawCols = Array.isArray(sp.colleges)
            ? sp.colleges
            : Object.entries(sp.colleges).map(([k, v]) => Object.assign({ id: v.id || v.collegeId || k }, v));

        return rawCols.map(col => {
            const rawMajors = Array.isArray(col.majors)
                ? col.majors
                : Object.entries(col.majors || {}).map(([mk, mv]) => Object.assign({ id: mv.id || mv.majorId || mk }, mv));
            return Object.assign({}, col, {
                id: col.id || col.collegeId,
                majors: rawMajors.map(m => Object.assign({}, m, { id: m.id || m.majorId }))
            });
        });
    };

    window.findCourseByCode = function (rawCode) {
        if (!rawCode) return null;
        const clean = String(rawCode).replace(/\s+/g, '').toUpperCase();
        const spaced = clean.replace(/^([A-Z]+)(\d+)$/, '$1 $2');
        const all = window.ALL_REAL_COURSES || {};
        const comp = window.REAL_COMPUTING_COURSES || {};
        const health = window.REAL_HEALTH_COURSES || {};
        const bus = window.REAL_BUSINESS_COURSES || {};
        const theo = window.REAL_THEORETICAL_COURSES || {};

        return (
            all[clean] || all[spaced] ||
            comp[clean] || comp[spaced] ||
            health[clean] || health[spaced] ||
            bus[clean] || bus[spaced] ||
            theo[clean] || theo[spaced] ||
            null
        );
    };

    window.rebuildNormalizedCoursesArray = function () {
        const allMap = window.ALL_REAL_COURSES || {};
        const arr = Object.values(allMap).map(c => {
            const resources = (Array.isArray(c.resources) ? c.resources : []).map(r => ({
                type: r.type || 'link',
                title: r.title || r.text || 'مصدر تعليمي',
                text: r.text || r.title || 'مصدر تعليمي',
                url: r.url || r.link || '#',
                link: r.link || r.url || '#'
            }));
            return Object.assign({}, c, {
                code: c.code,
                title: c.title || c.titleAr || c.code,
                titleAr: c.titleAr || c.title || c.code,
                titleEn: c.titleEn || c.code,
                college: c.collegeId || 'computing',
                collegeId: c.collegeId || 'computing',
                collegeAr: c.college || 'كلية الحوسبة والمعلوماتية',
                department: c.major || c.college || 'جامعة الأمير مساعد بن عبدالرحمن',
                creditHours: Number(c.credits || c.creditHours) || 3,
                credits: Number(c.credits || c.creditHours) || 3,
                level: Number(c.level) || 3,
                descriptionAr: c.desc || c.descriptionAr || '',
                desc: c.desc || c.descriptionAr || '',
                resources,
                authorName: window.getCourseAuthorName(c),
                authorUid: c.authorUid || (c.addedBy && c.addedBy.id) || 'community',
                authorEmail: c.authorEmail || (c.addedBy && c.addedBy.email) || ''
            });
        });
        window.REAL_COURSES_DATA = arr;
        return arr;
    };
    window.rebuildNormalizedCoursesArray();
    document.addEventListener('pmaru:courses-updated', () => {
        window.rebuildNormalizedCoursesArray();
    });

    // 10. Record Contributor Points in Firestore for Leaderboard
    async function recordUserContribution(user, code, isNewCourse, addedResourcesCount) {
        if (!user || !window.db) return;
        const authorName = user.displayName || (user.email ? user.email.split('@')[0] : 'طالب مساهم');
        try {
            const contribRef = window.db.collection('contributions').doc(user.uid);
            const doc = await contribRef.get();
            const existing = doc.exists ? doc.data() : {};
            const coursesSet = new Set(Array.isArray(existing.courses) ? existing.courses : []);
            coursesSet.add(code);

            const coursesCount = isNewCourse ? (Number(existing.coursesCount) || 0) + 1 : (Number(existing.coursesCount) || coursesSet.size);
            const resourcesCount = (Number(existing.resourcesCount) || 0) + Math.max(1, addedResourcesCount || 1);
            const points = (coursesCount * 10) + (resourcesCount * 5);

            await contribRef.set({
                uid: user.uid,
                name: authorName,
                email: user.email || '',
                coursesCount,
                resourcesCount,
                points,
                courses: Array.from(coursesSet),
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (e) {}
    }

    // 11. Admin-Only Course Deletion
    window.deleteCourseAsAdmin = async function (rawCode) {
        const cleanCode = String(rawCode || '').replace(/\s+/g, '').toUpperCase();
        if (!window.isPmaruAdmin(window.currentPmaruUser)) {
            alert('عذراً، صلاحية حذف المقررات مخصصة لحساب المشرف العام (الأدمن) فقط.');
            return;
        }
        if (!confirm(`هل أنت متأكد من حذف المقرر (${cleanCode}) نهائياً؟ (صلاحية أدمن)`)) {
            return;
        }

        // Remove from local bundles
        mergeCourseIntoBundles(cleanCode, { status: 'deleted' });
        try {
            const saved = JSON.parse(localStorage.getItem('pmaru_custom_courses') || '{}');
            delete saved[cleanCode];
            localStorage.setItem('pmaru_custom_courses', JSON.stringify(saved));

            const delList = JSON.parse(localStorage.getItem('pmaru_deleted_courses') || '[]');
            if (!delList.includes(cleanCode)) delList.push(cleanCode);
            localStorage.setItem('pmaru_deleted_courses', JSON.stringify(delList));
        } catch (e) {}

        // Delete from Firestore
        if (window.db) {
            try {
                await window.db.collection('userCourses').doc(cleanCode).delete();
            } catch (e) {}
            try {
                await window.db.collection('health_courses').doc(cleanCode).delete();
            } catch (e) {}
        }

        window.closeModal();
        document.dispatchEvent(new CustomEvent('pmaru:courses-updated', { detail: { code: cleanCode, deleted: true } }));
    };

    // 12. Modals: Course Details, Add Course, & Edit Course
    function populateMajorSelectForCollege(collegeId, currentMajor) {
        const col = COLLEGE_REGISTRY[collegeId] || COLLEGE_REGISTRY.computing;
        const selectEl = document.getElementById('newCourseMajor');
        const badgeEl = document.getElementById('addModalCollegeBadge');
        const hiddenColInput = document.getElementById('newCourseCollegeId');

        if (hiddenColInput) hiddenColInput.value = col.id;
        if (badgeEl) badgeEl.textContent = col.nameAr;
        if (selectEl) {
            const majorsList = [...col.majors];
            const selectedMajor = majorsList.includes(currentMajor) ? currentMajor : majorsList[0];
            selectEl.innerHTML = majorsList.map(m => `<option value="${m}" ${m === selectedMajor ? 'selected' : ''}>${m}</option>`).join('');
        }
    }

    function ensureModalsInDOM() {
        if (!document.getElementById('courseModal')) {
            const modalHTML = `
            <div id="courseModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalCourseTitle">
                <div class="modal-content">
                    <button type="button" class="close-btn" onclick="closeModal()" aria-label="إغلاق">&times;</button>
                    <div id="modalDynamicBody"></div>
                    <div id="modal-course-rating-section"></div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        if (!document.getElementById('addCourseModal')) {
            const addModalHTML = `
            <div id="addCourseModal" class="modal" role="dialog" aria-modal="true">
                <div class="modal-content" style="max-width:660px;">
                    <button type="button" class="close-btn" onclick="closeAddCourseModal()" aria-label="إغلاق">&times;</button>
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                        <span class="pmaru-badge" id="addModalCollegeBadge">كلية الحوسبة والمعلوماتية</span>
                        <span class="pmaru-badge" style="background:rgba(16,185,129,0.12); color:#10B981; border-color:rgba(16,185,129,0.3);">
                            <i class="fas fa-cloud-upload-alt"></i> مرتبط بـ Firebase Firestore
                        </span>
                    </div>
                    <h2 id="addModalHeading" style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; margin-bottom:0.35rem;">
                        <i class="fas fa-plus-circle" style="color:var(--accent-primary);"></i> إضافة مقرر جديد للكلية
                    </h2>
                    <p id="addModalSubtext" style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.25rem;">
                        سيتم توثيق اسمك كمساهم على بطاقة المقرر وفي لوحة المتصدرين فور النشر.
                    </p>
                    <form id="pmaruAddCourseForm">
                        <input type="hidden" id="newCourseCollegeId" value="computing">
                        <input type="hidden" id="newCourseEditMode" value="false">
                        <div style="display:grid; grid-template-columns:1fr 2fr; gap:0.85rem;">
                            <div class="form-group">
                                <label>رمز المقرر *</label>
                                <input type="text" id="newCourseCode" required placeholder="مثال: CS230 أو LAW101" style="text-transform:uppercase; direction:ltr;">
                            </div>
                            <div class="form-group">
                                <label>اسم المقرر *</label>
                                <input type="text" id="newCourseTitle" required placeholder="مثال: البرمجة الشيئية">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1.3fr 1fr 0.8fr; gap:0.85rem;">
                            <div class="form-group">
                                <label>التخصص الأكاديمي (حسب الكلية) *</label>
                                <select id="newCourseMajor" required></select>
                            </div>
                            <div class="form-group">
                                <label>المستوى الدراسي</label>
                                <select id="newCourseLevel">
                                    <option value="1">المستوى 1</option>
                                    <option value="2">المستوى 2</option>
                                    <option value="3" selected>المستوى 3</option>
                                    <option value="4">المستوى 4</option>
                                    <option value="5">المستوى 5</option>
                                    <option value="6">المستوى 6</option>
                                    <option value="7">المستوى 7</option>
                                    <option value="8">المستوى 8</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>الساعات</label>
                                <input type="number" id="newCourseCredits" min="1" max="6" value="3">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>وصف المقرر ونصائح المذاكرة *</label>
                            <textarea id="newCourseDesc" rows="3" required placeholder="نبذة عن محتوى المقرر وأفضل طريقة لمذاكرته..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>المصادر التعليمية والشروحات (يوتيوب، تليجرام، درايف)</label>
                            <div id="pmaruResourcesInputs" style="display:flex; flex-direction:column; gap:0.55rem;"></div>
                            <button type="button" onclick="window.addPmaruResourceRow()" class="pmaru-btn-outline" style="margin-top:0.6rem; font-size:0.8rem;">
                                <i class="fas fa-plus"></i> إضافة رابط مصدر أو شرح آخر
                            </button>
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.25rem;">
                            <button type="button" onclick="closeAddCourseModal()" class="pmaru-btn-outline">إلغاء</button>
                            <button type="submit" id="addCourseSubmitBtn" class="pmaru-btn-primary"><i class="fas fa-cloud-upload-alt"></i> حفظ ونشر التعديلات</button>
                        </div>
                    </form>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', addModalHTML);

            const form = document.getElementById('pmaruAddCourseForm');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    if (!window.currentPmaruUser) {
                        window.location.href = resolveRelativeAuthUrl('auth.html');
                        return;
                    }
                    const submitBtn = document.getElementById('addCourseSubmitBtn');
                    if (submitBtn) submitBtn.disabled = true;

                    const isEditMode = document.getElementById('newCourseEditMode').value === 'true';
                    const collegeId = document.getElementById('newCourseCollegeId').value || detectCurrentCollegeId() || 'computing';
                    const colObj = COLLEGE_REGISTRY[collegeId] || COLLEGE_REGISTRY.computing;
                    const code = document.getElementById('newCourseCode').value.trim().replace(/\s+/g, '').toUpperCase();
                    const title = document.getElementById('newCourseTitle').value.trim();
                    const major = document.getElementById('newCourseMajor').value;
                    const level = parseInt(document.getElementById('newCourseLevel').value, 10) || 3;
                    const credits = parseInt(document.getElementById('newCourseCredits').value, 10) || 3;
                    const desc = document.getElementById('newCourseDesc').value.trim();

                    const resources = [];
                    document.querySelectorAll('#pmaruResourcesInputs .pmaru-res-row').forEach(row => {
                        const type = row.querySelector('.res-type').value;
                        const text = row.querySelector('.res-text').value.trim() || 'مصدر تعليمي';
                        const link = row.querySelector('.res-link').value.trim();
                        if (link) resources.push({ type, text, link });
                    });

                    const user = window.currentPmaruUser;
                    const authorName = user.displayName || (user.email ? user.email.split('@')[0] : 'طالب مساهم');

                    const coursePayload = {
                        code,
                        title,
                        desc,
                        major,
                        level,
                        credits,
                        college: colObj.nameAr,
                        collegeId: colObj.id,
                        resources,
                        overwriteResources: true,
                        authorName,
                        authorUid: user.uid,
                        authorEmail: user.email || '',
                        addedBy: {
                            id: user.uid,
                            name: authorName,
                            email: user.email || ''
                        },
                        isUserAdded: true,
                        updatedAt: new Date().toISOString(),
                        createdAt: new Date().toISOString()
                    };

                    try {
                        const saved = JSON.parse(localStorage.getItem('pmaru_custom_courses') || '{}');
                        saved[code] = coursePayload;
                        localStorage.setItem('pmaru_custom_courses', JSON.stringify(saved));
                    } catch (err) {}

                    mergeCourseIntoBundles(code, coursePayload);

                    if (window.db) {
                        try {
                            await window.db.collection('userCourses').doc(code).set(coursePayload, { merge: true });
                            if (collegeId === 'health') {
                                await window.db.collection('health_courses').doc(code).set(coursePayload, { merge: true });
                            }
                            await recordUserContribution(user, code, !isEditMode, resources.length);
                        } catch (err) {
                            console.warn('Firestore write notice:', err.message);
                        }
                    }

                    if (submitBtn) submitBtn.disabled = false;
                    form.reset();
                    document.dispatchEvent(new CustomEvent('pmaru:courses-updated', { detail: { code, collegeId } }));
                    injectCourseCardContributorsAndActions();
                    window.closeAddCourseModal();
                    window.openCourseModal(code);
                });
            }
        }
    }

    window.addPmaruResourceRow = function (initialType, initialText, initialLink) {
        const container = document.getElementById('pmaruResourcesInputs');
        if (!container) return;
        const row = document.createElement('div');
        row.className = 'pmaru-res-row';
        row.style.cssText = 'display:grid; grid-template-columns:120px 1fr 1.3fr 36px; gap:0.5rem; align-items:center;';
        const t = initialType || 'youtube';
        row.innerHTML = `
            <select class="res-type">
                <option value="youtube" ${t === 'youtube' ? 'selected' : ''}>يوتيوب</option>
                <option value="telegram" ${t === 'telegram' ? 'selected' : ''}>تليجرام</option>
                <option value="drive" ${t === 'drive' ? 'selected' : ''}>جوجل درايف</option>
                <option value="blackboard" ${t === 'blackboard' ? 'selected' : ''}>بلاك بورد</option>
            </select>
            <input type="text" class="res-text" placeholder="اسم الشرح أو القناة" value="${(initialText || '').replace(/"/g, '&quot;')}">
            <input type="url" class="res-link" placeholder="https://..." style="direction:ltr;" value="${(initialLink || '').replace(/"/g, '&quot;')}">
            <button type="button" onclick="this.parentElement.remove()" class="pmaru-icon-btn" style="width:34px; height:34px; color:#FB7185;" title="حذف الرابط">&times;</button>
        `;
        container.appendChild(row);
    };

    // Open Course Details Modal (With Contributor Badge + Edit for All Logged-In + Delete for Admin Only)
    window.openCourseModal = function (courseCode, fallbackTitle) {
        ensureModalsInDOM();
        const cleanCode = String(courseCode || '').replace(/\s+/g, '').toUpperCase();
        const course = window.findCourseByCode(cleanCode) || {
            code: cleanCode,
            title: fallbackTitle || cleanCode,
            desc: 'مقرر أكاديمي معتمد ضمن الخطة الدراسية في جامعة الأمير مساعد بن عبدالرحمن.',
            credits: 3,
            level: 3,
            major: 'المقررات الجامعية',
            authorName: 'مبادرة طلاب الكلية',
            resources: [
                { type: 'telegram', text: 'الأرشيف الأكاديمي الشامل', link: 'https://t.me/computingg' },
                { type: 'drive', text: 'حقيبة المقررات والملخصات', link: 'https://drive.google.com/drive/u/2/folders/171QmzC3gsixrvVAUKqi2AWA0RAYLgxZC' }
            ]
        };

        const modal = document.getElementById('courseModal');
        const dynamicBody = document.getElementById('modalDynamicBody');
        const authorName = window.getCourseAuthorName(course);
        const isLogged = Boolean(window.currentPmaruUser);
        const isAdmin = window.isPmaruAdmin(window.currentPmaruUser);

        const resources = Array.isArray(course.resources) && course.resources.length > 0
            ? course.resources
            : [
                { type: 'telegram', text: 'قناة تجميعات وشروحات المقرر', link: 'https://t.me/computingg' },
                { type: 'drive', text: 'مجلد الكتب والسلايدات المعتمدة', link: 'https://drive.google.com/drive/u/2/folders/171QmzC3gsixrvVAUKqi2AWA0RAYLgxZC' }
            ];

        const prereqList = Array.isArray(course.prerequisites) && course.prerequisites.length > 0
            ? course.prerequisites.join(' ، ')
            : (course.prereq || 'لا يوجد متطلب سابق');

        const resourceCardsHTML = resources.map(res => {
            const t = String(res.type || '').toLowerCase();
            let icon = 'fa-external-link-alt';
            let btnClass = 'telegram-btn';
            let typeLabel = 'مصدر تعليمي';

            if (t.includes('youtube')) {
                icon = 'fab fa-youtube';
                btnClass = 'youtube-btn';
                typeLabel = 'شرح فيديو يوتيوب';
            } else if (t.includes('telegram')) {
                icon = 'fab fa-telegram-plane';
                btnClass = 'telegram-btn';
                typeLabel = 'قناة / أرشيف تليجرام';
            } else if (t.includes('drive')) {
                icon = 'fab fa-google-drive';
                btnClass = 'drive-btn';
                typeLabel = 'ملفات جوجل درايف';
            } else if (t.includes('blackboard')) {
                icon = 'fas fa-chalkboard-teacher';
                btnClass = 'blackboard-btn';
                typeLabel = 'منصة البلاك بورد';
            }

            const linkHref = res.link || res.url || '#';
            return `
                <div class="resource-card">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${typeLabel}</span>
                        <i class="${icon}" style="font-size:1.1rem; color:var(--accent-primary);"></i>
                    </div>
                    <h3>${res.text || 'رابط المصدر'}</h3>
                    <a href="${linkHref}" target="_blank" rel="noopener noreferrer" class="resource-btn ${btnClass}">
                        <i class="${icon}"></i> فتح المصدر الآن
                    </a>
                </div>
            `;
        }).join('');

        // Role-based Action Buttons in Modal
        const editActionHTML = isLogged
            ? `<button type="button" onclick="openEditCourseModal('${cleanCode}')" class="pmaru-btn-primary" style="font-size:0.84rem; padding:0.5rem 1rem;">
                   <i class="fas fa-pen-to-square"></i> تعديل المقرر / إضافة شرح
               </button>`
            : `<a href="${resolveRelativeAuthUrl('auth.html')}" class="pmaru-btn-outline" style="font-size:0.82rem; padding:0.45rem 0.9rem;">
                   <i class="fas fa-user-lock"></i> سجل دخولك لتعديل أو إضافة مصادر
               </a>`;

        const adminDeleteHTML = isAdmin
            ? `<button type="button" onclick="deleteCourseAsAdmin('${cleanCode}')" class="pmaru-btn-outline" style="font-size:0.84rem; padding:0.5rem 1rem; border-color:rgba(244,63,94,0.45); color:#FB7185; background:rgba(244,63,94,0.1);">
                   <i class="fas fa-trash"></i> حذف المقرر (أدمن)
               </button>`
            : '';

        const bodyHTML = `
            <div style="margin-bottom:1.25rem;">
                <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem; margin-bottom:0.75rem;">
                    <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem;">
                        <span class="course-code" style="font-size:0.95rem;">${cleanCode}</span>
                        <span class="course-level-tag"><i class="fas fa-layer-group"></i> المستوى ${course.level || 3}</span>
                        <span class="course-level-tag"><i class="fas fa-clock"></i> ${course.credits || course.hours || 3} ساعات معتمدة</span>
                        <span class="course-level-tag"><i class="fas fa-graduation-cap"></i> ${course.major || 'تخصص أكاديمي'}</span>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                        ${editActionHTML}
                        ${adminDeleteHTML}
                    </div>
                </div>

                <h2 id="modalCourseTitle" style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.5rem;">
                    ${course.title}
                </h2>

                <div style="display:flex; flex-wrap:wrap; align-items:center; gap:1rem; font-size:0.84rem; color:var(--text-secondary);">
                    <span class="pmaru-badge" style="background:rgba(16,185,129,0.12); color:#10B981; border-color:rgba(16,185,129,0.3);">
                        <i class="fas fa-user-check"></i> أضيفت بواسطة: <strong>${authorName}</strong>
                    </span>
                    <span><strong style="color:var(--text-primary);">المتطلب السابق:</strong> ${prereqList}</span>
                    ${course.studyTips ? `<span><strong style="color:var(--accent-emerald);">نصيحة المذاكرة:</strong> ${course.studyTips}</span>` : ''}
                </div>
            </div>

            <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.1rem; margin-bottom:1.25rem;">
                <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-primary);">
                    <i class="fas fa-info-circle" style="color:var(--accent-primary);"></i> نبذة ووصف المقرر
                </h3>
                <p id="modalCourseDesc" style="font-size:0.92rem; color:var(--text-secondary); line-height:1.7;">
                    ${course.desc || 'لا يوجد وصف إضافي مسجل لهذا المقرر.'}
                </p>
                <div style="display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:0.9rem;">
                    <button type="button" onclick="window.copyCourseShareLink('${cleanCode}')" class="share-course-btn">
                        <i class="fas fa-share-alt"></i> نسخ رابط مشاركة المقرر
                    </button>
                    <a href="https://drive.google.com/drive/u/2/folders/171QmzC3gsixrvVAUKqi2AWA0RAYLgxZC" target="_blank" rel="noopener" class="share-course-btn">
                        <i class="fas fa-folder-open"></i> الحقيبة الأكاديمية الشاملة
                    </a>
                </div>
            </div>

            <div style="margin-bottom:1.35rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:var(--text-primary);">
                        <i class="fas fa-play-circle" style="color:var(--accent-primary);"></i> الشروحات والمصادر التعليمية (${resources.length})
                    </h3>
                </div>
                <div id="course-resources" class="resources-section">
                    ${resourceCardsHTML}
                </div>
            </div>

            <!-- Final Exam Target Calculator Widget inside Course Modal -->
            <div style="background:linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.06)); border:1px solid var(--border-strong); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1.25rem;">
                <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.5rem; margin-bottom:0.85rem;">
                    <div>
                        <h3 style="font-family:var(--font-display); font-size:1.08rem; font-weight:800; color:var(--text-primary); margin:0;">
                            <i class="fas fa-bullseye" style="color:#F59E0B;"></i> حاسبة الدرجة المطلوبة في الفاينل (${cleanCode})
                        </h3>
                        <p style="font-size:0.8rem; color:var(--text-secondary); margin:0.2rem 0 0;">
                            أدخل درجاتك الحالية في أعمال السنة (40 درجة) والميد (20 درجة) لمعرفة الدرجة المطلوبة في الاختبار النهائي (40 درجة) لكل تقدير
                        </p>
                    </div>
                    <span class="pmaru-badge" style="background:rgba(245,158,11,0.14); color:#F59E0B; border-color:rgba(245,158,11,0.35);">
                        حساب فوري 100%
                    </span>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
                    <div>
                        <label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.3rem;">أعمال السنة (من 40)</label>
                        <input type="number" id="modalCalcCw" class="pmaru-input" min="0" max="40" step="0.5" value="27" oninput="window.updateModalFinalCalc()">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.3rem;">الميد (من 20)</label>
                        <input type="number" id="modalCalcMid" class="pmaru-input" min="0" max="20" step="0.5" value="15" oninput="window.updateModalFinalCalc()">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.3rem;">درجة الفاينل القصوى</label>
                        <select id="modalCalcFinalMax" class="pmaru-select" style="width:100%;" onchange="window.updateModalFinalCalc()">
                            <option value="40" selected>40 درجة</option>
                        </select>
                    </div>
                </div>

                <div id="modalFinalCalcSummaryAlert" style="margin-bottom:0.85rem;"></div>
                <div id="modalFinalCalcGradesGrid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(115px, 1fr)); gap:0.55rem;"></div>
            </div>
        `;

        if (dynamicBody) {
            dynamicBody.innerHTML = bodyHTML;
            if (typeof window.updateModalFinalCalc === 'function') {
                window.updateModalFinalCalc();
            }
        }

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        if (typeof window.initCourseRating === 'function') {
            window.initCourseRating(cleanCode, { containerId: 'modal-course-rating-section' });
        }
    };

    window.openModal = window.openCourseModal;

    window.closeModal = function () {
        const modal = document.getElementById('courseModal');
        if (modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Auth-gated, college-scoped Add Course Modal
    window.openAddCourseModal = function (explicitCollegeId) {
        if (!window.currentPmaruUser) {
            window.location.href = resolveRelativeAuthUrl('auth.html');
            return;
        }
        ensureModalsInDOM();
        const collegeId = explicitCollegeId || detectCurrentCollegeId() || 'computing';
        populateMajorSelectForCollege(collegeId);

        document.getElementById('newCourseEditMode').value = 'false';
        const codeInput = document.getElementById('newCourseCode');
        if (codeInput) {
            codeInput.value = '';
            codeInput.readOnly = false;
        }
        document.getElementById('newCourseTitle').value = '';
        document.getElementById('newCourseDesc').value = '';
        document.getElementById('newCourseLevel').value = '3';
        document.getElementById('newCourseCredits').value = '3';
        document.getElementById('addModalHeading').innerHTML = `<i class="fas fa-plus-circle" style="color:var(--accent-primary);"></i> إضافة مقرر جديد للكلية`;

        const resContainer = document.getElementById('pmaruResourcesInputs');
        if (resContainer) {
            resContainer.innerHTML = '';
            window.addPmaruResourceRow('youtube', '', '');
        }

        const modal = document.getElementById('addCourseModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    // Edit Course Modal (Available to ALL Authenticated Users)
    window.openEditCourseModal = function (rawCode) {
        if (!window.currentPmaruUser) {
            window.location.href = resolveRelativeAuthUrl('auth.html');
            return;
        }
        ensureModalsInDOM();
        window.closeModal();

        const cleanCode = String(rawCode || '').replace(/\s+/g, '').toUpperCase();
        const course = window.findCourseByCode(cleanCode) || {
            code: cleanCode,
            title: cleanCode,
            desc: '',
            level: 3,
            credits: 3,
            major: 'علوم الحاسب',
            collegeId: detectCurrentCollegeId() || 'computing',
            resources: []
        };

        const collegeId = classifyCourseCollege(cleanCode, course);
        populateMajorSelectForCollege(collegeId, course.major);

        document.getElementById('newCourseEditMode').value = 'true';
        const codeInput = document.getElementById('newCourseCode');
        if (codeInput) {
            codeInput.value = cleanCode;
            codeInput.readOnly = true;
        }
        document.getElementById('newCourseTitle').value = course.title || cleanCode;
        document.getElementById('newCourseDesc').value = course.desc || '';
        document.getElementById('newCourseLevel').value = String(course.level || 3);
        document.getElementById('newCourseCredits').value = String(course.credits || 3);
        document.getElementById('addModalHeading').innerHTML = `<i class="fas fa-pen-to-square" style="color:var(--accent-primary);"></i> تعديل المقرر وإضافة المصادر (${cleanCode})`;

        const resContainer = document.getElementById('pmaruResourcesInputs');
        if (resContainer) {
            resContainer.innerHTML = '';
            const existingRes = Array.isArray(course.resources) ? course.resources : [];
            if (existingRes.length === 0) {
                window.addPmaruResourceRow('youtube', '', '');
            } else {
                existingRes.forEach(r => {
                    window.addPmaruResourceRow(r.type || 'youtube', r.text || '', r.link || r.url || '');
                });
            }
        }

        const modal = document.getElementById('addCourseModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeAddCourseModal = function () {
        const modal = document.getElementById('addCourseModal');
        if (modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Full Academic Calendar Modal (1448H Official Dates)
    window.openAcademicCalendarModal = function () {
        let modal = document.getElementById('academicCalendarModal');
        if (!modal) {
            const html = `
            <div id="academicCalendarModal" class="modal" role="dialog" aria-modal="true">
                <div class="modal-content" style="max-width:760px;">
                    <button type="button" class="close-btn" onclick="document.getElementById('academicCalendarModal').classList.remove('show'); document.getElementById('academicCalendarModal').style.display='none'; document.body.style.overflow='';" aria-label="إغلاق">&times;</button>
                    <div style="margin-bottom:1.25rem;">
                        <span class="pmaru-badge"><i class="fas fa-calendar-alt"></i> التقويم الأكاديمي الرسمي 1448هـ (2026-2027م)</span>
                        <h2 style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; margin-top:0.5rem;">
                            مواعيد الفصول الدراسية والاختبارات — جامعة الأمير مساعد بن عبدالرحمن
                        </h2>
                    </div>
                    <div id="fullCalendarEventsList" style="display:flex; flex-direction:column; gap:0.75rem;"></div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            modal = document.getElementById('academicCalendarModal');
        }

        const listEl = document.getElementById('fullCalendarEventsList');
        const cal = window.ACADEMIC_CALENDAR;
        if (listEl && cal && Array.isArray(cal.events)) {
            const now = new Date();
            const sorted = [...cal.events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            listEl.innerHTML = sorted.map(ev => {
                const start = new Date(ev.startDate + 'T00:00:00');
                const diffDays = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
                const isExam = ev.type === 'midterm_exams' || ev.type === 'final_exams' || ev.category === 'exam';
                const statusBadge = diffDays > 0
                    ? `<span class="course-level-tag" style="color:${isExam ? '#F59E0B' : 'var(--accent-primary)'}; border-color:${isExam ? 'rgba(245,158,11,0.35)' : 'var(--border-subtle)'};">متبقي ${diffDays} يوم</span>`
                    : `<span class="course-level-tag" style="color:var(--text-muted);">مكتمل / منقضٍ</span>`;
                return `
                    <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; padding:1rem 1.15rem; border-radius:var(--radius-md); background:var(--bg-surface); border:1px solid ${isExam ? 'rgba(245,158,11,0.35)' : 'var(--border-subtle)'};">
                        <div style="display:flex; align-items:center; gap:0.85rem;">
                            <div style="width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:${isExam ? 'rgba(245,158,11,0.14)' : 'rgba(14,165,233,0.12)'}; color:${isExam ? '#F59E0B' : 'var(--accent-primary)'}; font-size:1.1rem;">
                                <i class="fas ${ev.icon || (isExam ? 'fa-file-signature' : 'fa-calendar-day')}"></i>
                            </div>
                            <div>
                                <div style="font-weight:700; color:var(--text-primary); font-size:0.96rem;">${ev.nameAr || ev.titleAr || ''}</div>
                                <div style="font-size:0.8rem; color:var(--text-secondary);">${ev.descriptionAr || ev.nameEn || ''}</div>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:0.65rem;">
                            <span style="font-family:var(--font-mono); font-size:0.82rem; color:var(--text-secondary); direction:ltr;">${ev.startDate}${ev.endDate && ev.endDate !== ev.startDate ? ' → ' + ev.endDate : ''}</span>
                            ${statusBadge}
                        </div>
                    </div>
                `;
            }).join('');
        }

        modal.classList.remove('hidden');
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    // 13. Final Exam Target Score Calculator Engine (Reusable in Course Modal & Academic Planner)
    const GRADE_THRESHOLDS = [
        { grade: 'A+', minTotal: 95, color: '#10B981', label: 'ممتاز مرتفع' },
        { grade: 'A',  minTotal: 90, color: '#34D399', label: 'ممتاز' },
        { grade: 'B+', minTotal: 85, color: '#38BDF8', label: 'جيد جداً مرتفع' },
        { grade: 'B',  minTotal: 80, color: '#0EA5E9', label: 'جيد جداً' },
        { grade: 'C+', minTotal: 75, color: '#F59E0B', label: 'جيد مرتفع' },
        { grade: 'C',  minTotal: 70, color: '#FBBF24', label: 'جيد' },
        { grade: 'D+', minTotal: 65, color: '#A855F7', label: 'مقبول مرتفع' },
        { grade: 'D',  minTotal: 60, color: '#FB7185', label: 'نجاح (الحد الأدنى)' }
    ];

    window.computeFinalExamTargets = function (courseworkScore, midtermScore, finalMaxWeight) {
        const cw = Math.min(40, Math.max(0, Number(courseworkScore) || 0));
        const mid = Math.min(20, Math.max(0, Number(midtermScore) || 0));
        const finalMax = 40;
        const currentTotal = cw + mid;
        const maxPossibleTotal = currentTotal + finalMax;

        const targets = GRADE_THRESHOLDS.map(tier => {
            const rawNeeded = Number((tier.minTotal - currentTotal).toFixed(1));
            const needed = Math.max(0, rawNeeded);
            const guaranteed = rawNeeded <= 0;
            const impossible = rawNeeded > finalMax;
            const percentOfFinal = Math.min(100, Math.max(0, Math.round((needed / finalMax) * 100)));

            return {
                grade: tier.grade,
                label: tier.label,
                minTotal: tier.minTotal,
                color: tier.color,
                rawNeeded,
                needed,
                finalMax,
                guaranteed,
                impossible,
                percentOfFinal
            };
        });

        return {
            cw,
            mid,
            finalMax,
            currentTotal: Number(currentTotal.toFixed(1)),
            maxPossibleTotal: Number(maxPossibleTotal.toFixed(1)),
            targets
        };
    };

    window.renderFinalCalcIntoContainers = function (cw, mid, finalMax, alertEl, gridEl) {
        const res = window.computeFinalExamTargets(cw, mid, finalMax);
        if (alertEl) {
            const topAchievable = res.targets.find(t => !t.impossible);
            if (!topAchievable) {
                alertEl.innerHTML = `
                    <div style="padding:0.7rem 0.95rem; border-radius:var(--radius-sm); background:rgba(244,63,94,0.14); border:1px solid rgba(244,63,94,0.4); color:#FB7185; font-size:0.84rem; font-weight:700;">
                        <i class="fas fa-exclamation-triangle"></i> تنبيه: مجموعك الحالي (${res.currentTotal}) مع الدرجة الكاملة للفاينل (${res.finalMax}) يصل إلى <strong>${res.maxPossibleTotal}/100</strong> وهو أقل من درجة النجاح (60). تواصل مع أستاذ المقرر حول أعمال السنة الإضافية (Bonus).
                    </div>`;
            } else {
                const aPlusTarget = res.targets[0];
                const extraNote = aPlusTarget.impossible
                    ? `• تنبيه: تقدير A+ يتطلب ${aPlusTarget.rawNeeded} من ${res.finalMax} (يتجاوز الدرجة القصوى للفاينل)، وأعلى تقدير متاح لك هو <strong style="color:${topAchievable.color};">${topAchievable.grade}</strong> (بمجموع أقصى ${res.maxPossibleTotal}/100).`
                    : `• بإمكانك تحقيق تقدير <strong style="color:#10B981;">A+</strong> بالحصول على <strong>${aPlusTarget.needed} من ${res.finalMax}</strong> في الاختبار النهائي!`;
                alertEl.innerHTML = `
                    <div style="padding:0.7rem 0.95rem; border-radius:var(--radius-sm); background:var(--bg-surface); border:1px solid var(--border-subtle); color:var(--text-secondary); font-size:0.83rem;">
                        <strong style="color:var(--text-primary);">مجموعك قبل الفاينل: ${res.currentTotal} درجة</strong> ${extraNote}
                    </div>`;
            }
        }

        if (gridEl) {
            gridEl.innerHTML = res.targets.map(t => {
                let statusBadge = '';
                let cardOpacity = '1';
                let borderStyle = `1px solid var(--border-subtle)`;

                if (t.guaranteed) {
                    statusBadge = `<span style="font-size:0.72rem; color:#10B981; font-weight:800;"><i class="fas fa-check-circle"></i> مضمون (0)</span>`;
                    borderStyle = `1px solid rgba(16,185,129,0.45)`;
                } else if (t.impossible) {
                    statusBadge = `<span style="font-size:0.7rem; color:#FB7185; font-weight:700;"><i class="fas fa-ban"></i> يتطلب ${t.rawNeeded}/${t.finalMax}</span>`;
                    cardOpacity = '0.58';
                    borderStyle = `1px dashed rgba(244,63,94,0.35)`;
                } else {
                    statusBadge = `<span style="font-size:0.74rem; color:var(--text-secondary);">تحتاج <strong style="color:var(--text-primary); font-family:var(--font-mono);">${t.needed}</strong> / ${t.finalMax}</span>`;
                    borderStyle = `1px solid rgba(14,165,233,0.32)`;
                }

                return `
                    <div style="background:var(--bg-card); border:${borderStyle}; border-radius:var(--radius-md); padding:0.7rem 0.65rem; text-align:center; opacity:${cardOpacity};">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.25rem;">
                            <span style="font-family:var(--font-mono); font-size:1.05rem; font-weight:900; color:${t.color};">${t.grade}</span>
                            <span style="font-size:0.68rem; color:var(--text-muted);">${t.minTotal}+</span>
                        </div>
                        <div style="margin-bottom:0.2rem;">${statusBadge}</div>
                        <div style="font-size:0.68rem; color:var(--text-muted);">${t.impossible ? 'يتجاوز سقف الفاينل' : `(${t.percentOfFinal}% من الفاينل)`}</div>
                    </div>
                `;
            }).join('');
        }
    };

    window.updateModalFinalCalc = function () {
        const cw = document.getElementById('modalCalcCw')?.value || 0;
        const mid = document.getElementById('modalCalcMid')?.value || 0;
        const fMax = document.getElementById('modalCalcFinalMax')?.value || 40;
        const alertEl = document.getElementById('modalFinalCalcSummaryAlert');
        const gridEl = document.getElementById('modalFinalCalcGradesGrid');
        window.renderFinalCalcIntoContainers(cw, mid, fMax, alertEl, gridEl);
    };

    // 14. Shareable Plan URL Helpers (Base64 URL Params — Zero DB Required)
    window.encodeShareablePlanUrl = function (payloadObj) {
        try {
            const jsonStr = JSON.stringify(payloadObj);
            const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
            const url = new URL(window.location.href);
            url.searchParams.set('plan', b64);
            return url.toString();
        } catch (e) {
            return window.location.href;
        }
    };

    window.decodeShareablePlanFromUrl = function () {
        try {
            const params = new URLSearchParams(window.location.search);
            const b64 = params.get('plan');
            if (!b64) return null;
            const jsonStr = decodeURIComponent(escape(atob(b64)));
            return JSON.parse(jsonStr);
        } catch (e) {
            return null;
        }
    };

    window.copyCourseShareLink = function (code) {
        const url = new URL(window.location.href);
        url.searchParams.set('course', code);
        const shareStr = url.toString();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareStr).then(() => {
                alert('تم نسخ رابط المقرر بنجاح:\n' + shareStr);
            }).catch(() => {
                prompt('انسخ رابط المقرر:', shareStr);
            });
        } else {
            prompt('انسخ رابط المقرر:', shareStr);
        }
    };

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            e.target.classList.add('hidden');
            e.target.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeModal();
            window.closeAddCourseModal();
            const calModal = document.getElementById('academicCalendarModal');
            if (calModal) {
                calModal.classList.remove('show');
                calModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const cParam = params.get('course');
            if (cParam) {
                setTimeout(() => window.openCourseModal(cParam), 50);
                return;
            }
            if (window.location.hash && window.location.hash.startsWith('#course-')) {
                const hCode = window.location.hash.replace('#course-', '');
                setTimeout(() => window.openCourseModal(hCode), 50);
            }
        } catch (e) {}
    });
})();
