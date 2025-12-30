// Course Rating System - تقييم المقررات
// يعمل مع Firebase و localStorage كـ fallback
class CourseRatingSystem {
    constructor(courseCode, options = {}) {
        this.courseCode = courseCode;
        this.storageKey = `course_ratings_${courseCode}`;
        this.useFirebase = options.useFirebase !== false && typeof firebase !== 'undefined';
        this.db = options.db || (this.useFirebase ? firebase.firestore() : null);
        this.containerId = options.containerId || 'course-rating-section';
        this.ratings = { stars: [], difficulty: [], reviews: [] };
        this.init();
    }

    async init() {
        await this.loadRatings();
        this.renderRatingSection();
        this.setupEventListeners();
    }

    // Load ratings from Firebase or localStorage
    async loadRatings() {
        // Try Firebase first
        if (this.useFirebase && this.db) {
            try {
                const doc = await this.db.collection('course_ratings').doc(this.courseCode).get();
                if (doc.exists) {
                    this.ratings = doc.data();
                    // Also cache in localStorage
                    localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
                    return;
                }
            } catch (error) {
                console.log('Firebase not available, using localStorage:', error.message);
            }
        }
        
        // Fallback to localStorage
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.ratings = JSON.parse(stored);
        } else {
            this.ratings = { stars: [], difficulty: [], reviews: [] };
        }
    }

    // Save ratings to Firebase and localStorage
    async saveRatings() {
        // Always save to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
        
        // Try to save to Firebase
        if (this.useFirebase && this.db) {
            try {
                await this.db.collection('course_ratings').doc(this.courseCode).set(this.ratings);
                console.log('✅ تم حفظ التقييم في Firebase');
            } catch (error) {
                console.log('تم حفظ التقييم محلياً:', error.message);
            }
        }
    }

    // Calculate average stars
    getAverageStars() {
        if (this.ratings.stars.length === 0) return 0;
        const sum = this.ratings.stars.reduce((a, b) => a + b, 0);
        return (sum / this.ratings.stars.length).toFixed(1);
    }

    // Get difficulty badge
    getDifficultyBadge() {
        if (this.ratings.difficulty.length === 0) return { text: 'لم يتم التقييم بعد', class: 'badge-neutral', icon: 'fa-question' };
        
        const avgDifficulty = this.ratings.difficulty.reduce((a, b) => a + b, 0) / this.ratings.difficulty.length;
        
        if (avgDifficulty <= 2) {
            return { text: 'سهلة', class: 'badge-easy', icon: 'fa-smile', color: '#10b981' };
        } else if (avgDifficulty <= 3.5) {
            return { text: 'متوسطة', class: 'badge-medium', icon: 'fa-meh', color: '#f59e0b' };
        } else {
            return { text: 'صعبة', class: 'badge-hard', icon: 'fa-frown', color: '#ef4444' };
        }
    }

    // Check if user already rated
    hasUserRated() {
        return localStorage.getItem(`${this.storageKey}_user_rated`) === 'true';
    }

    // Mark user as rated
    markUserRated() {
        localStorage.setItem(`${this.storageKey}_user_rated`, 'true');
    }

    // Render the rating section
    renderRatingSection() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const avgStars = this.getAverageStars();
        const difficultyBadge = this.getDifficultyBadge();
        const totalRatings = this.ratings.stars.length;
        const hasRated = this.hasUserRated();

        container.innerHTML = `
            <div class="rating-container glass-card rounded-2xl p-8 mb-8">
                <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <i class="fas fa-star text-yellow-400"></i>
                    تقييم المادة
                </h2>
                
                <!-- Rating Summary -->
                <div class="rating-summary grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Stars Rating -->
                    <div class="rating-box bg-nebula/30 rounded-xl p-4 text-center">
                        <div class="text-4xl font-bold text-yellow-400 mb-2">${avgStars || '0.0'}</div>
                        <div class="stars-display mb-2">
                            ${this.renderStars(avgStars)}
                        </div>
                        <div class="text-stardust/70 text-sm">${totalRatings} تقييم</div>
                    </div>
                    
                    <!-- Difficulty Badge -->
                    <div class="rating-box bg-nebula/30 rounded-xl p-4 text-center">
                        <div class="difficulty-badge ${difficultyBadge.class} inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2" style="background-color: ${difficultyBadge.color || '#6b7280'}20; border: 1px solid ${difficultyBadge.color || '#6b7280'}">
                            <i class="fas ${difficultyBadge.icon}" style="color: ${difficultyBadge.color || '#6b7280'}"></i>
                            <span style="color: ${difficultyBadge.color || '#6b7280'}" class="font-bold">${difficultyBadge.text}</span>
                        </div>
                        <div class="text-stardust/70 text-sm">مستوى الصعوبة</div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="rating-box bg-nebula/30 rounded-xl p-4 text-center">
                        <div class="flex justify-center gap-2 mb-2">
                            ${this.renderQuickBadges()}
                        </div>
                        <div class="text-stardust/70 text-sm">آراء الطلاب</div>
                    </div>
                </div>

                <!-- User Rating Form -->
                ${!hasRated ? `
                <div class="user-rating-form bg-nebula/20 rounded-xl p-6 mb-6">
                    <h3 class="text-lg font-bold text-white mb-4">قيّم هذه المادة</h3>
                    
                    <!-- Star Rating Input -->
                    <div class="mb-4">
                        <label class="text-stardust/70 text-sm mb-2 block">تقييمك للمادة</label>
                        <div class="star-rating-input flex gap-1" id="star-input">
                            ${[1,2,3,4,5].map(i => `
                                <button type="button" class="star-btn text-3xl text-gray-500 hover:text-yellow-400 transition-colors" data-rating="${i}">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="selected-stars" value="0">
                    </div>
                    
                    <!-- Difficulty Rating -->
                    <div class="mb-4">
                        <label class="text-stardust/70 text-sm mb-2 block">مستوى صعوبة المادة</label>
                        <div class="difficulty-input flex flex-wrap gap-2" id="difficulty-input">
                            <button type="button" class="difficulty-btn px-4 py-2 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all" data-difficulty="1">
                                <i class="fas fa-smile ml-1"></i> سهلة جداً
                            </button>
                            <button type="button" class="difficulty-btn px-4 py-2 rounded-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all" data-difficulty="2">
                                <i class="fas fa-smile-beam ml-1"></i> سهلة
                            </button>
                            <button type="button" class="difficulty-btn px-4 py-2 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all" data-difficulty="3">
                                <i class="fas fa-meh ml-1"></i> متوسطة
                            </button>
                            <button type="button" class="difficulty-btn px-4 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all" data-difficulty="4">
                                <i class="fas fa-meh-rolling-eyes ml-1"></i> صعبة
                            </button>
                            <button type="button" class="difficulty-btn px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all" data-difficulty="5">
                                <i class="fas fa-frown ml-1"></i> صعبة جداً
                            </button>
                        </div>
                        <input type="hidden" id="selected-difficulty" value="0">
                    </div>
                    
                    <!-- Badges Selection -->
                    <div class="mb-4">
                        <label class="text-stardust/70 text-sm mb-2 block">وصف المادة (اختر ما ينطبق)</label>
                        <div class="badges-input flex flex-wrap gap-2" id="badges-input">
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="practical">
                                <i class="fas fa-laptop-code ml-1"></i> عملية
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="theoretical">
                                <i class="fas fa-book ml-1"></i> نظرية
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="projects">
                                <i class="fas fa-project-diagram ml-1"></i> مشاريع
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="exams">
                                <i class="fas fa-file-alt ml-1"></i> اختبارات كثيرة
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="assignments">
                                <i class="fas fa-tasks ml-1"></i> واجبات كثيرة
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="useful">
                                <i class="fas fa-lightbulb ml-1"></i> مفيدة
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="needs-prerequisite">
                                <i class="fas fa-link ml-1"></i> تحتاج متطلبات سابقة
                            </button>
                            <button type="button" class="badge-btn px-3 py-1 rounded-full border border-plasma text-plasma hover:bg-plasma hover:text-white transition-all text-sm" data-badge="memorization">
                                <i class="fas fa-brain ml-1"></i> تحتاج حفظ
                            </button>
                        </div>
                    </div>
                    
                    <!-- Review Text -->
                    <div class="mb-4">
                        <label class="text-stardust/70 text-sm mb-2 block">رأيك في المادة (اختياري)</label>
                        <textarea id="review-text" class="w-full bg-cosmic/50 border border-nebula rounded-xl p-3 text-white placeholder-stardust/50 focus:border-plasma focus:outline-none" rows="3" placeholder="شاركنا تجربتك مع هذه المادة..."></textarea>
                    </div>
                    
                    <button type="button" id="submit-rating" class="w-full bg-gradient-to-r from-plasma to-aurora text-white py-3 px-6 rounded-full font-medium transition duration-300 hover:scale-105">
                        <i class="fas fa-paper-plane ml-2"></i> إرسال التقييم
                    </button>
                </div>
                ` : `
                <div class="already-rated bg-aurora/20 border border-aurora/50 rounded-xl p-4 text-center mb-6">
                    <i class="fas fa-check-circle text-aurora text-2xl mb-2"></i>
                    <p class="text-aurora">شكراً لك! لقد قمت بتقييم هذه المادة مسبقاً</p>
                </div>
                `}

                <!-- Recent Reviews -->
                <div class="reviews-section">
                    <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <i class="fas fa-comments text-photon"></i>
                        آراء الطلاب
                    </h3>
                    <div id="reviews-list" class="space-y-3">
                        ${this.renderReviews()}
                    </div>
                </div>
            </div>
        `;
    }

    // Render stars display
    renderStars(rating) {
        let html = '';
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                html += '<i class="fas fa-star text-yellow-400"></i>';
            } else if (i === fullStars + 1 && hasHalf) {
                html += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
            } else {
                html += '<i class="far fa-star text-yellow-400"></i>';
            }
        }
        return html;
    }

    // Render quick badges based on votes
    renderQuickBadges() {
        const badgeCounts = {};
        this.ratings.reviews.forEach(review => {
            if (review.badges) {
                review.badges.forEach(badge => {
                    badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
                });
            }
        });

        const badgeLabels = {
            'practical': { text: 'عملية', icon: 'fa-laptop-code', color: '#6C63FF' },
            'theoretical': { text: 'نظرية', icon: 'fa-book', color: '#A5A6FF' },
            'projects': { text: 'مشاريع', icon: 'fa-project-diagram', color: '#00D1B2' },
            'exams': { text: 'اختبارات', icon: 'fa-file-alt', color: '#FF8E3C' },
            'assignments': { text: 'واجبات', icon: 'fa-tasks', color: '#f59e0b' },
            'useful': { text: 'مفيدة', icon: 'fa-lightbulb', color: '#10b981' },
            'needs-prerequisite': { text: 'متطلبات سابقة', icon: 'fa-link', color: '#8b5cf6' },
            'memorization': { text: 'حفظ', icon: 'fa-brain', color: '#ec4899' }
        };

        const sortedBadges = Object.entries(badgeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        if (sortedBadges.length === 0) {
            return '<span class="text-stardust/50 text-sm">لا توجد آراء بعد</span>';
        }

        return sortedBadges.map(([badge, count]) => {
            const info = badgeLabels[badge] || { text: badge, icon: 'fa-tag', color: '#6b7280' };
            return `
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs" style="background-color: ${info.color}20; color: ${info.color}">
                    <i class="fas ${info.icon}"></i>
                    ${info.text}
                </span>
            `;
        }).join('');
    }

    // Render reviews
    renderReviews() {
        if (this.ratings.reviews.length === 0) {
            return '<p class="text-stardust/50 text-center py-4">لا توجد آراء بعد. كن أول من يقيّم!</p>';
        }

        return this.ratings.reviews.slice(-10).reverse().map(review => `
            <div class="review-card bg-nebula/20 rounded-xl p-4">
                <div class="flex items-start gap-3">
                    <div class="bg-plasma/20 rounded-full p-2">
                        <i class="fas fa-user text-plasma"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-white font-medium">طالب</span>
                            <span class="text-stardust/50 text-xs">${review.date}</span>
                        </div>
                        <div class="flex items-center gap-2 mb-2">
                            <div class="stars-small">${this.renderStars(review.stars)}</div>
                            ${review.difficulty ? `
                                <span class="text-xs px-2 py-1 rounded-full ${this.getDifficultyClass(review.difficulty)}">
                                    ${this.getDifficultyText(review.difficulty)}
                                </span>
                            ` : ''}
                        </div>
                        ${review.badges && review.badges.length > 0 ? `
                            <div class="flex flex-wrap gap-1 mb-2">
                                ${review.badges.map(badge => this.renderBadge(badge)).join('')}
                            </div>
                        ` : ''}
                        ${review.text ? `<p class="text-stardust/70 text-sm">${review.text}</p>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getDifficultyText(level) {
        const texts = ['', 'سهلة جداً', 'سهلة', 'متوسطة', 'صعبة', 'صعبة جداً'];
        return texts[level] || '';
    }

    getDifficultyClass(level) {
        if (level <= 2) return 'bg-green-500/20 text-green-400';
        if (level <= 3) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-red-500/20 text-red-400';
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
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-plasma/20 text-photon text-xs"><i class="fas ${info.icon}"></i> ${info.text}</span>`;
    }

    // Setup event listeners
    setupEventListeners() {
        // Star rating
        document.querySelectorAll('.star-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rating = parseInt(e.currentTarget.dataset.rating);
                document.getElementById('selected-stars').value = rating;
                document.querySelectorAll('.star-btn').forEach((star, index) => {
                    star.classList.toggle('text-yellow-400', index < rating);
                    star.classList.toggle('text-gray-500', index >= rating);
                });
            });

            btn.addEventListener('mouseenter', (e) => {
                const rating = parseInt(e.currentTarget.dataset.rating);
                document.querySelectorAll('.star-btn').forEach((star, index) => {
                    star.classList.toggle('text-yellow-400', index < rating);
                    star.classList.toggle('text-gray-500', index >= rating);
                });
            });
        });

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = parseInt(e.currentTarget.dataset.difficulty);
                document.getElementById('selected-difficulty').value = difficulty;
                document.querySelectorAll('.difficulty-btn').forEach(b => {
                    b.classList.remove('active-difficulty');
                    b.style.backgroundColor = '';
                    b.style.color = '';
                });
                e.currentTarget.classList.add('active-difficulty');
                e.currentTarget.style.backgroundColor = getComputedStyle(e.currentTarget).borderColor;
                e.currentTarget.style.color = 'white';
            });
        });

        // Badge buttons
        document.querySelectorAll('.badge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.currentTarget.classList.toggle('badge-selected');
                if (e.currentTarget.classList.contains('badge-selected')) {
                    e.currentTarget.style.backgroundColor = '#6C63FF';
                    e.currentTarget.style.color = 'white';
                } else {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                }
            });
        });

        // Submit rating
        const submitBtn = document.getElementById('submit-rating');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitRating());
        }
    }

    // Submit rating
    async submitRating() {
        const stars = parseInt(document.getElementById('selected-stars').value);
        const difficulty = parseInt(document.getElementById('selected-difficulty').value);
        const reviewText = document.getElementById('review-text').value.trim();
        const selectedBadges = Array.from(document.querySelectorAll('.badge-btn.badge-selected'))
            .map(btn => btn.dataset.badge);

        if (stars === 0) {
            alert('الرجاء اختيار تقييم بالنجوم');
            return;
        }

        if (difficulty === 0) {
            alert('الرجاء اختيار مستوى الصعوبة');
            return;
        }

        // Add ratings
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
        
        // Show success message and re-render
        alert('شكراً لك! تم إرسال تقييمك بنجاح');
        this.renderRatingSection();
        this.setupEventListeners();
    }
}

// Global function to initialize rating for any course
window.initCourseRating = function(courseCode, options = {}) {
    return new CourseRatingSystem(courseCode, options);
};

// Initialize when DOM is ready (for static pages)
document.addEventListener('DOMContentLoaded', () => {
    const courseCodeElement = document.querySelector('[data-course-code]');
    if (courseCodeElement) {
        const courseCode = courseCodeElement.dataset.courseCode;
        new CourseRatingSystem(courseCode);
    }
});
