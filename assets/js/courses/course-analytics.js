/**
 * Subject Search 2.0 - Course Analytics Engine
 * Compiles privacy-conscious trends, rating distributions, and workload analytics.
 */

import { courseService } from '../services/course-service.js';

export class CourseAnalytics {
    static getOverviewMetrics() {
        const courses = courseService.getAllCourses();
        if (!courses.length) return null;

        const totalReviews = courses.reduce((sum, c) => sum + (c.reviewCount || 0), 0);
        const avgDifficulty = (courses.reduce((sum, c) => sum + (c.difficulty || 0), 0) / courses.length).toFixed(1);
        const avgRating = (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1);

        // Highest rated (min 15 reviews)
        const highestRated = [...courses]
            .filter(c => (c.reviewCount || 0) >= 15)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);

        // Most challenging courses
        const hardestCourses = [...courses]
            .sort((a, b) => b.difficulty - a.difficulty)
            .slice(0, 5);

        // Most reviewed
        const mostReviewed = [...courses]
            .sort((a, b) => b.reviewCount - a.reviewCount)
            .slice(0, 5);

        return {
            totalCourses: courses.length,
            totalReviews,
            avgDifficulty,
            avgRating,
            highestRated,
            hardestCourses,
            mostReviewed
        };
    }
}

export default CourseAnalytics;
