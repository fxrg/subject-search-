/**
 * Subject Search 2.0 - Academic Synonym Dictionary & Normalizer
 * Provides multilingual academic synonym expansion and Arabic text normalization.
 */

// Normalized synonym groups mapping concepts to related academic keywords
export const ACADEMIC_SYNONYMS = {
    // Artificial Intelligence & Data Science
    'ذكاء اصطناعي': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'تعلم آلي', 'تعلم عميق', 'بيانات', 'data science', 'cs480', 'ds360'],
    'ai': ['ذكاء اصطناعي', 'machine learning', 'تعلم آلي', 'artificial intelligence', 'بيانات'],
    'تعلم آلي': ['machine learning', 'ml', 'ذكاء اصطناعي', 'ai', 'deep learning'],
    'machine learning': ['تعلم آلي', 'ai', 'ذكاء اصطناعي', 'deep learning', 'ml'],
    'بيانات': ['data', 'data science', 'database', 'قواعد بيانات', 'هياكل بيانات', 'data structure', 'تنقيب بيانات', 'إحصاء'],
    'data science': ['علوم بيانات', 'بيانات', 'machine learning', 'statistics', 'تحليل بيانات', 'إحصاء'],

    // Programming & Software Engineering
    'برمجة': ['programming', 'code', 'java', 'python', 'oop', 'كائنية التوجه', 'تطوير برمجيات'],
    'programming': ['برمجة', 'java', 'python', 'code', 'software', 'oop'],
    'oop': ['object oriented', 'كائنات', 'برمجة كائنية', 'java', 'cs230', 'ds230', 'it232'],
    'قواعد بيانات': ['database', 'db', 'sql', 'mysql', 'oracle', 'cs350', 'ds350', 'it244'],
    'database': ['قواعد بيانات', 'sql', 'db', 'data modeling', 'cs350'],
    'هياكل بيانات': ['data structures', 'algorithms', 'خوارزميات', 'قوائم', 'مكدسات', 'cs240', 'ds240'],
    'شبكات': ['networks', 'networking', 'security', 'أمن سيبراني', 'اتصالات', 'it240', 'cs360'],
    'أمن سيبراني': ['cybersecurity', 'security', 'أمن معلومات', 'تشفير', 'شبكات'],

    // Mathematics & Statistics
    'رياضيات': ['math', 'mathematics', 'calculus', 'تفاضل وتكامل', 'جبر خطي', 'linear algebra', 'math150'],
    'إحصاء': ['statistics', 'احتمالات', 'probability', 'stat', 'تحليل بيانات', 'stat101', 'stat201', 'r'],
    'statistics': ['إحصاء', 'احتمالات', 'probability', 'data analytics', 'regression', 'stat'],

    // Law & Legal Studies
    'قانون': ['حقوق', 'أنظمة', 'law', 'legal', 'تشريع', 'محاماة', 'دستور', 'عقوبات', 'مدني'],
    'law': ['قانون', 'أنظمة', 'legal', 'constitutional', 'commercial', 'criminal'],
    'محاماة': ['قانون', 'law', 'مرافعات', 'قضاء', 'أنظمة'],

    // Media & Communication
    'إعلام': ['media', 'صحافة', 'اتصال جماهيري', 'سوشيال ميديا', 'تصوير', 'محتوى رقمي'],
    'media': ['إعلام', 'صحافة', 'communication', 'journalism', 'social media', 'content'],

    // Translation & Languages
    'ترجمة': ['translation', 'لغات', 'english', 'انجليزي', 'ترجمة فورية', 'ترجمة آلية', 'cat tools'],
    'translation': ['ترجمة', 'languages', 'linguistics', 'interpretation'],

    // Business & Management
    'إدارة': ['management', 'business', 'أعمال', 'تسويق', 'إدارة أعمال', 'تنظيم'],
    'محاسبة': ['accounting', 'مالية', 'قوائم مالية', 'ضرائب', 'audit'],
    'تجارة إلكترونية': ['e-commerce', 'ecom', 'تسويق رقمي', 'متاجر إلكترونية']
};

/**
 * Normalize Arabic text for robust search (removes diacritics, standardizes Alef, Taa Marbuta, etc.)
 */
export function normalizeArabic(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        // Remove Arabic diacritics (Tashkeel)
        .replace(/[\u064B-\u065F\u0670]/g, '')
        // Standardize Alef
        .replace(/[إأآا]/g, 'ا')
        // Standardize Yaa / Alef Maqsura
        .replace(/[ىي]/g, 'ي')
        // Standardize Taa Marbuta / Haa
        .replace(/ة/g, 'ه')
        // Remove Tatweel
        .replace(/ـ/g, '')
        // Standardize Persian / Urdu Kaf
        .replace(/ک/g, 'ك')
        // Trim whitespace
        .trim();
}

/**
 * Expand a search query with semantic synonyms
 */
export function getSynonymsForQuery(query) {
    if (!query) return [];
    const normalized = normalizeArabic(query);
    const results = new Set([normalized]);

    for (const [key, synonyms] of Object.entries(ACADEMIC_SYNONYMS)) {
        const normKey = normalizeArabic(key);
        if (normKey === normalized || normalized.includes(normKey) || normKey.includes(normalized)) {
            synonyms.forEach(s => results.add(normalizeArabic(s)));
        }
    }

    return Array.from(results);
}
