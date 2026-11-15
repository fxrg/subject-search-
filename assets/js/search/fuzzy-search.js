/**
 * Subject Search 2.0 - Fuzzy Search & Typo Tolerance
 * Calculates edit distance and similarity scores for typo tolerance.
 */

import { normalizeArabic } from './synonyms.js';

export class FuzzySearch {
    /**
     * Compute Levenshtein distance between two strings
     */
    static levenshtein(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * Check if target matches query with typo tolerance
     * @param {string} target 
     * @param {string} query 
     * @param {number} maxDistance Max edit distance allowed
     */
    static matchesWithTypo(target, query, maxDistance = 2) {
        const normTarget = normalizeArabic(target);
        const normQuery = normalizeArabic(query);

        if (!normTarget || !normQuery) return false;
        if (normTarget.includes(normQuery)) return true;

        // Substring-level fuzzy check
        const targetWords = normTarget.split(/\s+/);
        const queryWords = normQuery.split(/\s+/);

        for (const qWord of queryWords) {
            if (qWord.length <= 2) continue; // Skip too short words for fuzzy
            let matched = false;
            for (const tWord of targetWords) {
                const dist = this.levenshtein(tWord, qWord);
                const allowedDist = qWord.length > 5 ? 2 : 1;
                if (dist <= allowedDist) {
                    matched = true;
                    break;
                }
            }
            if (matched) return true;
        }

        return false;
    }

    /**
     * Similarity score between 0.0 and 1.0
     */
    static score(target, query) {
        const normTarget = normalizeArabic(target);
        const normQuery = normalizeArabic(query);

        if (normTarget === normQuery) return 1.0;
        if (normTarget.startsWith(normQuery)) return 0.9;
        if (normTarget.includes(normQuery)) return 0.8;

        const maxLen = Math.max(normTarget.length, normQuery.length);
        if (maxLen === 0) return 1.0;

        const dist = this.levenshtein(normTarget, normQuery);
        return Math.max(0, 1 - dist / maxLen);
    }
}

export default FuzzySearch;
