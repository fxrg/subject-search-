/**
 * Subject Search 2.0 - Course Review & Rating Engine
 * Manages multi-dimensional course reviews, helpful votes, and duplicate prevention.
 */

import { idbStorage, STORES } from '../cache/indexeddb.js';

export class ReviewSystem {
    constructor() {
        this.reviews = [];
    }

    async init() {
        this.reviews = await idbStorage.getAll(STORES.REVIEWS);
    }

    /**
     * Submit a student review with anti-spam and duplicate checks
     */
    async submitReview({
        courseCode,
        userId,
        userName,
        overallRating,
        difficultyRating,
        workloadRating,
        examRating,
        reviewText
    }) {
        if (!userId) {
            return { success: false, message: 'يجب تسجيل الدخول لإضافة تقييم' };
        }

        // Duplicate check: One review per student per course
        const existing = this.reviews.find(r => r.courseCode === courseCode && r.userId === userId);
        if (existing) {
            return { success: false, message: 'لقد قمت بتقييم هذا المقرر مسبقاً' };
        }

        const newReview = {
            id: `rev_${Date.now()}_${userId.slice(0, 6)}`,
            courseCode,
            userId,
            userName: userName || 'طالب جامعي',
            overallRating: Number(overallRating) || 5,
            difficultyRating: Number(difficultyRating) || 3,
            workloadRating: Number(workloadRating) || 3,
            examRating: Number(examRating) || 3,
            reviewText: (reviewText || '').trim(),
            helpfulVotes: 0,
            votedUsers: [],
            createdAt: new Date().toISOString()
        };

        this.reviews.push(newReview);
        await idbStorage.set(STORES.REVIEWS, newReview);

        return { success: true, review: newReview };
    }

    /**
     * Upvote a helpful review
     */
    async voteHelpful(reviewId, userId) {
        if (!userId) return { success: false, message: 'سجل دخولك للتصويت' };
        const rev = this.reviews.find(r => r.id === reviewId);
        if (!rev) return { success: false, message: 'التقييم غير موجود' };

        if (!rev.votedUsers) rev.votedUsers = [];
        if (rev.votedUsers.includes(userId)) {
            return { success: false, message: 'لقد قمت بالتصويت على هذا التقييم بالفعل' };
        }

        rev.votedUsers.push(userId);
        rev.helpfulVotes = (rev.helpfulVotes || 0) + 1;
        await idbStorage.set(STORES.REVIEWS, rev);

        return { success: true, votes: rev.helpfulVotes };
    }

    getReviewsForCourse(courseCode) {
        return this.reviews
            .filter(r => r.courseCode === courseCode)
            .sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
    }
}

export const reviewSystem = new ReviewSystem();
export default reviewSystem;
