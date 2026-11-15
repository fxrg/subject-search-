/**
 * Subject Search 2.0 - Contribution System & Gamification
 * Rewards high-quality student contributions, badges, and academic reputation.
 */

export class GamificationSystem {
    static POINTS_MAP = {
        SUBMIT_REVIEW: 15,
        RECEIVE_HELPFUL_VOTE: 5,
        SHARE_RESOURCE: 10,
        ANSWER_QUESTION: 8,
        REPORT_DATA_CORRECTION: 12
    };

    static BADGES = [
        { id: 'first_review', nameAr: 'المراجع الأول', icon: 'award', description: 'كتابة أول تقييم لمقرر دراسي' },
        { id: 'top_contributor', nameAr: 'رائد المعرفة', icon: 'crown', description: 'تجاوز 100 نقطة مساهمة' },
        { id: 'resource_hero', nameAr: 'منارة المراجع', icon: 'book-bookmark', description: 'مشاركة 5 مصادر تعليمية معتمدة' },
        { id: 'academic_scholar', nameAr: 'باحث أكاديمي', icon: 'graduation-cap', description: 'إكمال خطة دراسية كاملة ومشاركتها' }
    ];

    /**
     * Calculate student reputation level based on points
     */
    static calculateLevel(points = 0) {
        if (points >= 500) return { level: 5, title: 'عميد المساهمين', nextThreshold: null };
        if (points >= 250) return { level: 4, title: 'مساهم متقدم', nextThreshold: 500 };
        if (points >= 100) return { level: 3, title: 'مساهم نشط', nextThreshold: 250 };
        if (points >= 30) return { level: 2, title: 'طالب متعاون', nextThreshold: 100 };
        return { level: 1, title: 'عضو جديد', nextThreshold: 30 };
    }
}

export default GamificationSystem;
