/**
 * Subject Search 2.0 - Configuration
 * Central configuration for platform constants, colleges, and settings.
 * University: جامعة الأمير مساعد بن عبدالرحمن (Prince Musaid bin Abdulrahman University - PMARU)
 */

export function getBasePrefix() {
    if (typeof window === 'undefined') return '.';
    const p = window.location.pathname.replace(/\\/g, '/');
    if (p.includes('/page/all-colleges/computing/') || 
        p.includes('/page/all-colleges/theoretical/') || 
        p.includes('/page/all-colleges/business/') || 
        p.includes('/page/all-colleges/health/')) {
        return '../../..';
    }
    if (p.includes('/page/planner/') || 
        p.includes('/page/prereq-graph/') || 
        p.includes('/page/compare/') || 
        p.includes('/page/all-colleges/') ||
        p.includes('/page/auth/') ||
        p.includes('/page/Blogs/')) {
        return '../..';
    }
    if (p.includes('/page/')) {
        return '..';
    }
    return '.';
}

export const CONFIG = {
    APP_NAME: 'Subject Search 2.0',
    UNIVERSITY_NAME_AR: 'جامعة الأمير مساعد بن عبدالرحمن',
    UNIVERSITY_NAME_EN: 'Prince Musaid bin Abdulrahman University',
    UNIVERSITY_CODE: 'PMARU',
    VERSION: '2.0.0',
    STORAGE_PREFIX: 'ss2_',
    CACHE_VERSION: 'v2.2',
    CACHE_EXPIRATION_MS: 24 * 60 * 60 * 1000, // 24 hours
    
    get DATA_PATHS() {
        const base = getBasePrefix();
        return {
            COURSES: `${base}/course_data.json`,
            COLLEGES_MANIFEST: `${base}/page/all-colleges/colleges-manifest.json`,
            ACADEMIC_CALENDAR: `${base}/data/academic-calendar.json`,
            STUDY_PLANS: `${base}/data/study-plans.json`
        };
    },

    COLLEGES: [
        {
            id: 'computing',
            nameAr: 'كلية الحوسبة والمعلوماتية',
            nameEn: 'College of Computing and Informatics',
            code: 'CCI',
            icon: 'laptop-code',
            url: './page/all-colleges/computing/computing.html',
            majors: [
                { id: 'cs', code: 'CS', nameAr: 'علوم الحاسب', nameEn: 'Computer Science' },
                { id: 'it', code: 'IT', nameAr: 'تقنية المعلومات', nameEn: 'Information Technology' },
                { id: 'ds', code: 'DS', nameAr: 'علوم البيانات', nameEn: 'Data Science' }
            ]
        },
        {
            id: 'business',
            nameAr: 'كلية العلوم الإدارية والمالية',
            nameEn: 'College of Administrative and Financial Sciences',
            code: 'CAFS',
            icon: 'chart-line',
            url: './page/all-colleges/business/business.html',
            majors: [
                { id: 'fin', code: 'FIN', nameAr: 'المالية', nameEn: 'Finance' },
                { id: 'acct', code: 'ACCT', nameAr: 'المحاسبة', nameEn: 'Accounting' },
                { id: 'ba', code: 'MGT', nameAr: 'إدارة الأعمال', nameEn: 'Business Administration' },
                { id: 'ecom', code: 'ECOM', nameAr: 'التجارة الإلكترونية', nameEn: 'E-Commerce' }
            ]
        },
        {
            id: 'health',
            nameAr: 'كلية العلوم الصحية',
            nameEn: 'College of Health Sciences',
            code: 'CHS',
            icon: 'heart-pulse',
            url: './page/all-colleges/health/health.html',
            majors: [
                { id: 'ph', code: 'PH', nameAr: 'الصحة العامة', nameEn: 'Public Health' },
                { id: 'hci', code: 'HCI', nameAr: 'المعلوماتية الصحية', nameEn: 'Health Informatics' }
            ]
        },
        {
            id: 'theoretical',
            nameAr: 'كلية الدراسات النظرية',
            nameEn: 'College of Theoretical Studies',
            code: 'CTS',
            icon: 'scale-balanced',
            url: './page/all-colleges/theoretical/theoretical.html',
            majors: [
                { id: 'law', code: 'LAW', nameAr: 'القانون', nameEn: 'Law' },
                { id: 'med', code: 'MED', nameAr: 'الإعلام الرقمي', nameEn: 'Digital Media' },
                { id: 'trn', code: 'TRN', nameAr: 'اللغات والترجمة', nameEn: 'Languages and Translation' },
                { id: 'stat', code: 'STAT', nameAr: 'الإحصاء التطبيقي وتحليل البيانات', nameEn: 'Applied Statistics and Data Analytics' }
            ]
        }
    ],
    THEMES: {
        DARK: 'dark',
        LIGHT: 'light'
    },
    LANGUAGES: {
        AR: 'ar',
        EN: 'en'
    }
};

export default CONFIG;
