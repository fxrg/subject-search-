/**
 * Subject Search 2.0 - Course Comparison Matrix
 * Allows multi-course side-by-side comparative analysis of workload, exams, and difficulty.
 */

import { courseService } from '../services/course-service.js';

export class CourseComparison {
    constructor() {
        this.selectedCourseIds = new Set();
        this.maxCourses = 4;
    }

    addCourse(courseId) {
        if (this.selectedCourseIds.size >= this.maxCourses) {
            return { success: false, message: 'الحد الأقصى للمقارنة هو 4 مقررات معاً' };
        }
        this.selectedCourseIds.add(courseId);
        return { success: true };
    }

    removeCourse(courseId) {
        this.selectedCourseIds.delete(courseId);
    }

    clear() {
        this.selectedCourseIds.clear();
    }

    getSelectedCourses() {
        return Array.from(this.selectedCourseIds)
            .map(id => courseService.getCourseById(id))
            .filter(Boolean);
    }

    /**
     * Generate HTML comparison matrix table
     */
    renderComparisonTable() {
        const courses = this.getSelectedCourses();
        if (courses.length === 0) {
            return `
                <div class="text-center py-12 text-gray-400">
                    <i class="fa-solid fa-code-compare text-4xl mb-3 text-indigo-400/50"></i>
                    <p>اختر مقررات للمقارنة بينها جنباً إلى جنب (حتى 4 مقررات)</p>
                </div>
            `;
        }

        const metrics = [
            { label: 'رمز المقرر', key: 'code', format: c => `<span class="font-bold text-indigo-400">${c.code}</span>` },
            { label: 'الكلية', key: 'collegeNameAr' },
            { label: 'التخصص', key: 'majorNameAr' },
            { label: 'الساعات المعتمدة', key: 'creditHours', format: c => `${c.creditHours} ساعات` },
            { label: 'المستوى الدراسي', key: 'level', format: c => `المستوى ${c.level}` },
            { 
                label: 'المتطلبات السابقة', 
                key: 'prerequisites', 
                format: c => c.prerequisites?.length ? c.prerequisites.join(' + ') : 'بدون متطلب' 
            },
            { 
                label: 'التقييم العام', 
                key: 'rating', 
                format: c => `<span class="text-amber-400 font-bold"><i class="fa-solid fa-star"></i> ${c.rating} / 5</span> <span class="text-xs text-gray-400">(${c.reviewCount} تقييم)</span>` 
            },
            { 
                label: 'معدل الصعوبة', 
                key: 'difficulty', 
                format: c => {
                    const diff = c.difficulty || 3.0;
                    const color = diff > 3.8 ? 'text-red-400' : (diff > 3.2 ? 'text-amber-400' : 'text-emerald-400');
                    return `<span class="${color} font-bold">${diff} / 5</span>`;
                } 
            },
            { label: 'حجم الجهد والمذاكرة', key: 'workload' },
            { label: 'صعوبة الاختبارات', key: 'examDifficulty', format: c => `${c.examDifficulty || 3.5} / 5` },
            { label: 'عبء المشاريع والتكاليف', key: 'projectWorkload', format: c => `${c.projectWorkload || 3.0} / 5` }
        ];

        let html = `
            <div class="overflow-x-auto">
                <table class="w-full text-right border-collapse text-sm">
                    <thead>
                        <tr class="border-b border-white/10 bg-white/5">
                            <th class="p-4 text-gray-400 font-semibold w-48">المعيار</th>
        `;

        courses.forEach(c => {
            html += `
                <th class="p-4 font-bold text-white min-w-[200px]">
                    <div class="flex items-center justify-between">
                        <span>${c.nameAr}</span>
                        <button onclick="window.courseCompareInstance?.removeCourseAndRerender('${c.id}')" class="text-gray-400 hover:text-red-400 transition">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </th>
            `;
        });

        html += `
                        </tr>
                    </thead>
                    <tbody>
        `;

        metrics.forEach((m, idx) => {
            const rowBg = idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]';
            html += `
                <tr class="border-b border-white/5 ${rowBg}">
                    <td class="p-4 font-medium text-gray-400">${m.label}</td>
            `;
            courses.forEach(c => {
                const val = m.format ? m.format(c) : (c[m.key] || '-');
                html += `<td class="p-4 text-gray-200">${val}</td>`;
            });
            html += `</tr>`;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        return html;
    }
}

export const courseComparison = new CourseComparison();
export default courseComparison;
