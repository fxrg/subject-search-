/**
 * Subject Search 2.0 - Smart Search Engine 2.0
 * Combines exact code matches, Arabic/English tokenization, fuzzy typo tolerance, and synonym expansion.
 */

import { normalizeArabic, getSynonymsForQuery } from './synonyms.js';
import { FuzzySearch } from './fuzzy-search.js';
import { courseService } from '../services/course-service.js';

const RECENT_SEARCHES_KEY = 'ss2_recent_searches';
const MAX_RECENT_SEARCHES = 8;

export class SearchEngine {
    constructor() {
        this.recentSearches = this.loadRecentSearches();
    }

    /**
     * Execute comprehensive search across all courses
     */
    search(query, filters = {}) {
        const allCourses = courseService.getAllCourses();
        const rawQuery = (query || '').trim();
        const normQuery = normalizeArabic(rawQuery);

        // Track recent searches if non-empty
        if (normQuery.length >= 2) {
            this.addRecentSearch(rawQuery);
        }

        // Apply filters first
        let filtered = courseService.filterCourses(filters);

        // If query is empty, return filtered list sorted by level and rating
        if (!normQuery) {
            return filtered.map(course => ({ course, score: 1.0, matchType: 'all' }));
        }

        // Generate synonym expansions
        const searchTerms = getSynonymsForQuery(normQuery);

        const scoredResults = [];

        filtered.forEach(course => {
            const courseCodeClean = course.code.replace(/\s+/g, '').toLowerCase();
            const queryCodeClean = normQuery.replace(/\s+/g, '').toLowerCase();

            const normNameAr = normalizeArabic(course.nameAr);
            const normNameEn = (course.nameEn || '').toLowerCase();
            const normDesc = normalizeArabic(course.description || '');

            let score = 0;
            let matchType = 'none';

            // 1. Exact or prefix code match (highest weight)
            if (courseCodeClean === queryCodeClean) {
                score = 100;
                matchType = 'exact_code';
            } else if (courseCodeClean.includes(queryCodeClean) || queryCodeClean.includes(courseCodeClean)) {
                score = 80;
                matchType = 'partial_code';
            }
            // 2. Exact or substring title match in Arabic or English
            else if (normNameAr.includes(normQuery) || normNameEn.includes(normQuery.toLowerCase())) {
                score = 70;
                matchType = 'exact_title';
            }
            // 3. Synonym match
            else {
                for (const term of searchTerms) {
                    if (normNameAr.includes(term) || normNameEn.includes(term)) {
                        score = Math.max(score, 55);
                        matchType = 'synonym_title';
                        break;
                    }
                    if (course.keywords && course.keywords.some(k => normalizeArabic(k).includes(term))) {
                        score = Math.max(score, 45);
                        matchType = 'keyword';
                        break;
                    }
                }
            }

            // 4. Fuzzy typo tolerance check if no high match found yet
            if (score === 0) {
                if (FuzzySearch.matchesWithTypo(course.nameAr, normQuery) ||
                    FuzzySearch.matchesWithTypo(course.nameEn, normQuery)) {
                    score = 40;
                    matchType = 'fuzzy_title';
                } else if (normDesc.includes(normQuery)) {
                    score = 30;
                    matchType = 'description';
                }
            }

            if (score > 0) {
                scoredResults.push({
                    course,
                    score,
                    matchType
                });
            }
        });

        // Sort descending by score, then by rating
        scoredResults.sort((a, b) => b.score - a.score || b.course.rating - a.course.rating);

        return scoredResults;
    }

    /**
     * Provide autocomplete suggestions as the user types
     */
    autocomplete(prefix, limit = 5) {
        if (!prefix || prefix.trim().length < 1) return [];
        const normPrefix = normalizeArabic(prefix.trim());
        const allCourses = courseService.getAllCourses();
        const suggestions = [];

        for (const c of allCourses) {
            const cleanCode = c.code.replace(/\s+/g, '').toLowerCase();
            const normAr = normalizeArabic(c.nameAr);
            const normEn = (c.nameEn || '').toLowerCase();

            if (cleanCode.startsWith(normPrefix) || normAr.startsWith(normPrefix) || normEn.startsWith(normPrefix.toLowerCase())) {
                suggestions.push({
                    code: c.code,
                    title: c.nameAr,
                    titleEn: c.nameEn,
                    college: c.collegeNameAr,
                    type: 'course'
                });
            }

            if (suggestions.length >= limit) break;
        }

        return suggestions;
    }

    /**
     * Recent searches management in localStorage
     */
    loadRecentSearches() {
        try {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    addRecentSearch(term) {
        if (!term) return;
        const trimmed = term.trim();
        this.recentSearches = this.recentSearches.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
        this.recentSearches.unshift(trimmed);
        if (this.recentSearches.length > MAX_RECENT_SEARCHES) {
            this.recentSearches.pop();
        }
        try {
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
        } catch (e) {}
    }

    getRecentSearches() {
        return this.recentSearches;
    }

    clearRecentSearches() {
        this.recentSearches = [];
        try {
            localStorage.removeItem(RECENT_SEARCHES_KEY);
        } catch (e) {}
    }

    /**
     * Trending courses based on rating, review count, and popularity
     */
    getTrendingCourses(limit = 6) {
        const courses = courseService.getAllCourses();
        return [...courses]
            .sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating))
            .slice(0, limit);
    }
}

export const searchEngine = new SearchEngine();
export default searchEngine;
