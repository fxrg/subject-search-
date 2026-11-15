// Course Rating System - نظام تقييم المقررات التفاعلي
// يعمل فورياً (0ms) عبر الحزمة الحقيقية و localStorage مع مزامنة حية مع Firebase Firestore
class CourseRatingSystem {
    constructor(courseCode, options = {}) {
        this.rawCourseCode = String(courseCode || '').trim();
        this.courseCode = this.rawCourseCode.replace(/\s+/g, '').toUpperCase();
        this.storageKey = `course_ratings_${this.courseCode}`;
        this.useFirebase = options.useFirebase !== false && typeof firebase !== 'undefined';
        this.db = options.db || (this.useFirebase && firebase.firestore ? firebase.firestore() : null);
        this.containerId = options.containerId || 'course-rating-section';
        this.ratings = this.getInitialRatings();
        this.init();
    }

    getInitialRatings() {
        // 1. Check localStorage first (includes user's own latest ratings)
        try {
            const stored = localStorage.getItem(this.storageKey) || localStorage.getItem(`course_ratings_${this.rawCourseCode}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && Array.isArray(parsed.stars)) {
                    return {
                        stars: parsed.stars || [],
                        difficulty: parsed.difficulty || [],
                        reviews: parsed.reviews || []
                    };
                }
            }
        } catch (e) {}

        // 2. Check preloaded real Firestore ratings bundle (0ms instant load on file:// and http://)
        if (typeof window !== 'undefined' && window.REAL_COURSE_RATINGS) {
            const bundleMatch =
                window.REAL_COURSE_RATINGS[this.courseCode] ||
                window.REAL_COURSE_RATINGS[this.rawCourseCode] ||
                window.REAL_COURSE_RATINGS[this.courseCode.replace(/^([A-Z]+)(\d+)$/, '$1 $2')];
            if (bundleMatch) {
                return JSON.parse(JSON.stringify({
                    stars: bundleMatch.stars || [],
                    difficulty: bundleMatch.difficulty || [],
                    reviews: bundleMatch.reviews || []
                }));
            }
        }

        return { stars: [], difficulty: [], reviews: [] };
    }

    async init() {
        // Render immediately in 0ms using initial ratings
        this.renderRatingSection();
        this.setupEventListeners();

        // Then sync with live Firestore in background
        await this.loadRatings();
    }

    async loadRatings() {
        if (this.useFirebase && this.db) {
            try {
                let doc = await this.db.collection('course_ratings').doc(this.courseCode).get();
                if (!doc.exists && this.rawCourseCode !== this.courseCode) {
                    doc = await this.db.collection('course_ratings').doc(this.rawCourseCode).get();
                }
                if (doc && doc.exists) {
                    const data = doc.data();
                    if (data && Array.isArray(data.stars)) {
                        this.ratings = {
                            stars: data.stars || [],
                            difficulty: data.difficulty || [],
                            reviews: data.reviews || []
                        };
                        try {
                            localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
                        } catch (e) {}
                        this.renderRatingSection();
                        this.setupEventListeners();
                    }
                }
            } catch (error) {
                // Silent fallback to preloaded bundle / localStorage when offline or on file://
            }
        }
    }

    async saveRatings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
        } catch (e) {}

        if (typeof window !== 'undefined' && window.REAL_COURSE_RATINGS) {
            window.REAL_COURSE_RATINGS[this.courseCode] = JSON.parse(JSON.stringify(this.ratings));
        }

        if (this.useFirebase && this.db) {
            try {
                await this.db.collection('course_ratings').doc(this.courseCode).set(this.ratings);
            } catch (error) {
                console.log('Saved rating locally:', error.message);
            }
        }
    }

    getAverageStars() {
        if (!this.ratings.stars || this.ratings.stars.length === 0) return 0;
        const sum = this.ratings.stars.reduce((a, b) => Number(a) + Number(b), 0);
        return (sum / this.ratings.stars.length).toFixed(1);
    }

    getDifficultyBadge() {
        if (!this.ratings.difficulty || this.ratings.difficulty.length === 0) {
            return { text: 'لم يتم التقييم بعد', class: 'badge-neutral', icon: 'fa-question-circle', color: '#64748b' };
        }
        const avgDifficulty = this.ratings.difficulty.reduce((a, b) => Number(a) + Number(b), 0) / this.ratings.difficulty.length;
        if (avgDifficulty <= 2) {
            return { text: 'سهلة', class: 'badge-easy', icon: 'fa-smile', color: '#10b981' };
        } else if (avgDifficulty <= 3.5) {
            return { text: 'متوسطة', class: 'badge-medium', icon: 'fa-meh', color: '#f59e0b' };
        } else {
            return { text: 'صعبة', class: 'badge-hard', icon: 'fa-frown', color: '#ef4444' };
        }
    }

    hasUserRated() {
        try {
            return localStorage.getItem(`${this.storageKey}_user_rated`) === 'true';
        } catch (e) {
            return false;
        }
    }

    markUserRated() {
        try {
            localStorage.setItem(`${this.storageKey}_user_rated`, 'true');
        } catch (e) {}
    }

    renderRatingSection() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const avgStars = this.getAverageStars();
        const difficultyBadge = this.getDifficultyBadge();
        const totalRatings = (this.ratings.stars || []).length;
        const hasRated = this.hasUserRated();

        container.innerHTML = `
            <div class="crs-container rating-container">
                <div class="crs-header">
                    <h3 class="crs-title">
                        <i class="fas fa-star" style="color:#f59e0b;"></i>
                        <span>تقييم المقرر وآراء الطلاب (${this.courseCode})</span>
                    </h3>
                    <span class="crs-count-pill">${totalRatings} تقييم مسجل</span>
                </div>

                <div class="crs-summary-grid rating-summary">
                    <div class="crs-box rating-box">
                        <div class="crs-score-num">${avgStars || '0.0'}</div>
                        <div class="crs-stars-row stars-display">${this.renderStars(avgStars)}</div>
                        <div class="crs-box-label">متوسط التقييم العام</div>
                    </div>

                    <div class="crs-box rating-box">
                        <div class="crs-diff-pill difficulty-badge ${difficultyBadge.class}" style="background:${difficultyBadge.color}18; border:1px solid ${difficultyBadge.color}55; color:${difficultyBadge.color};">
                            <i class="fas ${difficultyBadge.icon}"></i>
                            <span>${difficultyBadge.text}</span>
                        </div>
                        <div class="crs-box-label">مستوى الصعوبة</div>
                    </div>

                    <div class="crs-box rating-box">
                        <div class="crs-tags-wrap">${this.renderQuickBadges()}</div>
                        <div class="crs-box-label">أبرز سمات المقرر</div>
                    </div>
                </div>

                ${!hasRated ? `
                <div class="crs-form user-rating-form">
                    <h4 class="crs-subtitle"><i class="fas fa-pen-fancy"></i> أضف تقييمك وتجربتك مع المقرر</h4>
                    
                    <div class="crs-field">
                        <label class="crs-label">التقييم العام بالنجوم</label>
                        <div class="star-rating-input crs-star-input" data-role="star-input">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <button type="button" class="star-btn crs-star-btn" data-rating="${i}" aria-label="${i} نجوم">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" class="crs-selected-stars" id="selected-stars" value="0">
                    </div>

                    <div class="crs-field">
                        <label class="crs-label">مستوى صعوبة المادة</label>
                        <div class="difficulty-input crs-diff-group">
                            <button type="button" class="difficulty-btn crs-diff-btn" data-difficulty="1" data-color="#10b981">
                                <i class="fas fa-smile"></i> سهلة جداً
                            </button>
                            <button type="button" class="difficulty-btn crs-diff-btn" data-difficulty="2" data-color="#34d399">
                                <i class="fas fa-smile-beam"></i> سهلة
                            </button>
                            <button type="button" class="difficulty-btn crs-diff-btn" data-difficulty="3" data-color="#f59e0b">
                                <i class="fas fa-meh"></i> متوسطة
                            </button>
                            <button type="button" class="difficulty-btn crs-diff-btn" data-difficulty="4" data-color="#f97316">
                                <i class="fas fa-meh-rolling-eyes"></i> صعبة
                            </button>
                            <button type="button" class="difficulty-btn crs-diff-btn" data-difficulty="5" data-color="#ef4444">
                                <i class="fas fa-frown"></i> صعبة جداً
                            </button>
                        </div>
                        <input type="hidden" class="crs-selected-difficulty" id="selected-difficulty" value="0">
                    </div>

                    <div class="crs-field">
                        <label class="crs-label">طبيعة المقرر (اختر ما ينطبق)</label>
                        <div class="badges-input crs-badge-group">
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="practical"><i class="fas fa-laptop-code"></i> عملية</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="theoretical"><i class="fas fa-book"></i> نظرية</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="projects"><i class="fas fa-project-diagram"></i> مشاريع</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="exams"><i class="fas fa-file-alt"></i> اختبارات كثيرة</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="assignments"><i class="fas fa-tasks"></i> واجبات كثيرة</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="useful"><i class="fas fa-lightbulb"></i> مفيدة جداً</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="needs-prerequisite"><i class="fas fa-link"></i> تعتمد على متطلب سابق</button>
                            <button type="button" class="badge-btn crs-badge-btn" data-badge="memorization"><i class="fas fa-brain"></i> تحتاج حفظ</button>
                        </div>
                    </div>

                    <div class="crs-field">
                        <label class="crs-label">نصيحتك أو تجربتك مع المقرر (اختياري)</label>
                        <textarea id="review-text" class="crs-textarea" rows="3" placeholder="اكتب نصيحتك لزملائك حول طريقة المذاكرة، الكويزات، أو أفضل المصادر..."></textarea>
                    </div>

                    <button type="button" id="submit-rating" class="crs-submit-btn">
                        <i class="fas fa-paper-plane"></i> إرسال التقييم
                    </button>
                </div>
                ` : `
                <div class="crs-already-rated already-rated">
                    <i class="fas fa-check-circle"></i>
                    <span>شكراً لمشاركتك! تم تسجيل تقييمك لهذا المقرر.</span>
                </div>
                `}

                <div class="crs-reviews-section reviews-section">
                    <h4 class="crs-subtitle">
                        <i class="fas fa-comments" style="color:#0ea5e9;"></i>
                        <span>تجارب وآراء الطلاب (${(this.ratings.reviews || []).length})</span>
                    </h4>
                    <div id="reviews-list" class="crs-reviews-list">
                        ${this.renderReviews()}
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const num = Number(rating) || 0;
        let html = '';
        const fullStars = Math.floor(num);
        const hasHalf = num % 1 >= 0.5;
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                html += '<i class="fas fa-star" style="color:#f59e0b;"></i>';
            } else if (i === fullStars + 1 && hasHalf) {
                html += '<i class="fas fa-star-half-alt" style="color:#f59e0b;"></i>';
            } else {
                html += '<i class="far fa-star" style="color:#64748b;"></i>';
            }
        }
        return html;
    }

    renderQuickBadges() {
        const badgeCounts = {};
        (this.ratings.reviews || []).forEach(review => {
            if (Array.isArray(review.badges)) {
                review.badges.forEach(badge => {
                    badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
                });
            }
        });

        const badgeLabels = {
            'practical': { text: 'عملية', icon: 'fa-laptop-code', color: '#0ea5e9' },
            'theoretical': { text: 'نظرية', icon: 'fa-book', color: '#6366f1' },
            'projects': { text: 'مشاريع', icon: 'fa-project-diagram', color: '#10b981' },
            'exams': { text: 'اختبارات', icon: 'fa-file-alt', color: '#f97316' },
            'assignments': { text: 'واجبات', icon: 'fa-tasks', color: '#f59e0b' },
            'useful': { text: 'مفيدة', icon: 'fa-lightbulb', color: '#14b8a6' },
            'needs-prerequisite': { text: 'متطلبات سابقة', icon: 'fa-link', color: '#8b5cf6' },
            'memorization': { text: 'حفظ', icon: 'fa-brain', color: '#ec4899' }
        };

        const sortedBadges = Object.entries(badgeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        if (sortedBadges.length === 0) {
            return '<span class="crs-muted-text">بانتظار الأوسمة</span>';
        }

        return sortedBadges.map(([badge]) => {
            const info = badgeLabels[badge] || { text: badge, icon: 'fa-tag', color: '#64748b' };
            return `
                <span class="crs-tag-chip" style="background:${info.color}18; color:${info.color}; border:1px solid ${info.color}40;">
                    <i class="fas ${info.icon}"></i> ${info.text}
                </span>
            `;
        }).join('');
    }

    renderReviews() {
        const reviews = this.ratings.reviews || [];
        if (reviews.length === 0) {
            return '<div class="crs-empty-reviews">لا توجد مراجعات مكتوبة بعد — كن أول من يشارك تجربته مع الزملاء!</div>';
        }

        return reviews.slice(-10).reverse().map(review => `
            <div class="crs-review-card review-card">
                <div class="crs-review-header">
                    <div class="crs-review-user">
                        <span class="crs-avatar"><i class="fas fa-user-graduate"></i></span>
                        <div>
                            <div class="crs-author-name">طالب جامعي</div>
                            <div class="crs-review-date">${review.date || ''}</div>
                        </div>
                    </div>
                    <div class="crs-review-meta">
                        <span class="crs-stars-small">${this.renderStars(review.stars)}</span>
                        ${review.difficulty ? `
                            <span class="crs-diff-mini ${this.getDifficultyClass(review.difficulty)}">
                                ${this.getDifficultyText(review.difficulty)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                ${review.badges && review.badges.length > 0 ? `
                    <div class="crs-review-badges">
                        ${review.badges.map(badge => this.renderBadge(badge)).join('')}
                    </div>
                ` : ''}
                ${review.text ? `<p class="crs-review-text">${review.text}</p>` : ''}
            </div>
        `).join('');
    }

    getDifficultyText(level) {
        const texts = ['', 'سهلة جداً', 'سهلة', 'متوسطة', 'صعبة', 'صعبة جداً'];
        return texts[level] || '';
    }

    getDifficultyClass(level) {
        if (level <= 2) return 'crs-diff-easy';
        if (level <= 3) return 'crs-diff-med';
        return 'crs-diff-hard';
    }

    renderBadge(badge) {
        const badgeLabels = {
            'practical': { text: 'عملية', icon: 'fa-laptop-code' },
            'theoretical': { text: 'نظرية', icon: 'fa-book' },
            'projects': { text: 'مشاريع', icon: 'fa-project-diagram' },
            'exams': { text: 'اختبارات', icon: 'fa-file-alt' },
            'assignments': { text: 'واجبات', icon: 'fa-tasks' },
            'useful': { text: 'مفيدة', icon: 'fa-lightbulb' },
            'needs-prerequisite': { text: 'متطلبات سابقة', icon: 'fa-link' },
            'memorization': { text: 'حفظ', icon: 'fa-brain' }
        };
        const info = badgeLabels[badge] || { text: badge, icon: 'fa-tag' };
        return `<span class="crs-mini-badge"><i class="fas ${info.icon}"></i> ${info.text}</span>`;
    }

    setupEventListeners() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const starsInput = container.querySelector('.crs-selected-stars');
        const starBtns = container.querySelectorAll('.star-btn');

        starBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rating = parseInt(e.currentTarget.dataset.rating, 10);
                if (starsInput) starsInput.value = rating;
                starBtns.forEach((star, index) => {
                    star.classList.toggle('is-active', index < rating);
                });
            });
        });

        const diffInput = container.querySelector('.crs-selected-difficulty');
        const diffBtns = container.querySelectorAll('.difficulty-btn');
        diffBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = parseInt(e.currentTarget.dataset.difficulty, 10);
                if (diffInput) diffInput.value = difficulty;
                diffBtns.forEach(b => b.classList.remove('is-selected'));
                e.currentTarget.classList.add('is-selected');
            });
        });

        const badgeBtns = container.querySelectorAll('.badge-btn');
        badgeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.classList.toggle('badge-selected');
            });
        });

        const submitBtn = container.querySelector('#submit-rating');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitRating());
        }
    }

    async submitRating() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const starsEl = container.querySelector('.crs-selected-stars');
        const diffEl = container.querySelector('.crs-selected-difficulty');
        const textEl = container.querySelector('#review-text');

        const stars = starsEl ? parseInt(starsEl.value, 10) : 0;
        const difficulty = diffEl ? parseInt(diffEl.value, 10) : 0;
        const reviewText = textEl ? textEl.value.trim() : '';
        const selectedBadges = Array.from(container.querySelectorAll('.badge-btn.badge-selected'))
            .map(btn => btn.dataset.badge);

        if (!stars || stars === 0) {
            alert('الرجاء اختيار التقييم بالنجوم أولاً');
            return;
        }
        if (!difficulty || difficulty === 0) {
            alert('الرجاء تحديد مستوى صعوبة المقرر');
            return;
        }

        this.ratings.stars.push(stars);
        this.ratings.difficulty.push(difficulty);
        this.ratings.reviews.push({
            stars,
            difficulty,
            badges: selectedBadges,
            text: reviewText,
            date: new Date().toLocaleDateString('ar-SA')
        });

        await this.saveRatings();
        this.markUserRated();

        this.renderRatingSection();
        this.setupEventListeners();
    }
}

window.initCourseRating = function(courseCode, options = {}) {
    return new CourseRatingSystem(courseCode, options);
};

document.addEventListener('DOMContentLoaded', () => {
    const courseCodeElement = document.querySelector('[data-course-code]');
    if (courseCodeElement) {
        const courseCode = courseCodeElement.dataset.courseCode;
        new CourseRatingSystem(courseCode);
    }
});
