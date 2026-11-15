/**
 * Subject Search 2.0 - Prerequisite Dependency Graph
 * Interactive visual representation of course requirements, chains, and unlock states.
 */

import { courseService } from '../services/course-service.js';
import { plannerEngine } from '../planner/planner-engine.js';

export class PrerequisiteGraph {
    constructor(containerElement) {
        this.container = containerElement;
        this.scale = 1.0;
        this.selectedCourse = null;
    }

    /**
     * Detect if a circular prerequisite dependency exists in the catalog
     */
    static detectCircularDependencies(courses) {
        const visited = new Set();
        const recursionStack = new Set();
        const cycles = [];

        const checkCycle = (courseCode, path = []) => {
            visited.add(courseCode);
            recursionStack.add(courseCode);
            const course = courses.find(c => c.code === courseCode);

            if (course && course.prerequisites) {
                for (const pre of course.prerequisites) {
                    if (!visited.has(pre)) {
                        checkCycle(pre, [...path, courseCode]);
                    } else if (recursionStack.has(pre)) {
                        cycles.push([...path, courseCode, pre]);
                    }
                }
            }

            recursionStack.delete(courseCode);
        };

        courses.forEach(c => {
            if (!visited.has(c.code)) {
                checkCycle(c.code);
            }
        });

        return cycles;
    }

    /**
     * Compute state for each course relative to student progress
     * - completed (student passed)
     * - enrolled (taking now)
     * - available (prerequisites satisfied)
     * - blocked (missing prerequisites)
     */
    static evaluateCourseStatus(course, completedCodes = [], enrolledCodes = []) {
        if (completedCodes.includes(course.code)) return 'completed';
        if (enrolledCodes.includes(course.code)) return 'enrolled';

        const prereqs = course.prerequisites || [];
        if (prereqs.length === 0) return 'available';

        const hasAllPrereqs = prereqs.every(p => completedCodes.includes(p));
        return hasAllPrereqs ? 'available' : 'blocked';
    }

    /**
     * Render the visual dependency graph into container
     */
    render(filterMajor = null) {
        if (!this.container) return;

        const allCourses = courseService.getAllCourses();
        const profile = plannerEngine.getProfile();
        const completed = profile.completedCourses || [];
        const enrolled = profile.enrolledCourses || [];

        const filtered = filterMajor 
            ? allCourses.filter(c => c.major === filterMajor || (c.category === 'prep_year' && (filterMajor === 'cs' || filterMajor === 'it' || filterMajor === 'ds' ? c.college === 'computing' : c.major === filterMajor)))
            : allCourses.slice(0, 24);

        // Group by academic level (levels 1 through 8)
        const levels = {};
        for (let i = 1; i <= 8; i++) levels[i] = [];

        filtered.forEach(c => {
            const lvl = c.level || 1;
            if (!levels[lvl]) levels[lvl] = [];
            levels[lvl].push(c);
        });

        let html = `
            <div class="prereq-graph-controls flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div class="flex items-center gap-3 text-xs">
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> مكتمل</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500"></span> مسجل حالياً</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-500"></span> متاح للتسجيل</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-gray-500"></span> مقفل بمتطلب</span>
                </div>
                <div class="flex items-center gap-2">
                    <button class="zoom-btn p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs" onclick="window.prereqGraphInstance?.zoom(1.1)">
                        <i class="fa-solid fa-plus"></i> تكبير
                    </button>
                    <button class="zoom-btn p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs" onclick="window.prereqGraphInstance?.zoom(0.9)">
                        <i class="fa-solid fa-minus"></i> تصغير
                    </button>
                    <button class="zoom-btn p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs" onclick="window.prereqGraphInstance?.resetZoom()">
                        <i class="fa-solid fa-rotate-left"></i> إعادة ضبط
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto pb-6">
                <div id="graphCanvas" class="flex gap-8 min-w-[900px] transition-transform duration-200" style="transform: scale(${this.scale}); transform-origin: top right;">
        `;

        // Render level columns
        Object.keys(levels).forEach(lvlNum => {
            const coursesInLvl = levels[lvlNum];
            if (!coursesInLvl.length) return;

            html += `
                <div class="level-column flex-1 min-w-[200px]">
                    <div class="level-badge text-center py-2 px-3 rounded-xl bg-white/5 border border-white/10 mb-4 text-xs font-bold text-gray-300">
                        المستوى ${lvlNum}
                    </div>
                    <div class="flex flex-col gap-4">
            `;

            coursesInLvl.forEach(c => {
                const status = PrerequisiteGraph.evaluateCourseStatus(c, completed, enrolled);
                let badgeClass = 'border-gray-600/40 bg-gray-800/30 text-gray-400';
                let statusLabel = 'مقفل';
                let icon = 'lock';

                if (status === 'completed') {
                    badgeClass = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300';
                    statusLabel = 'مكتمل';
                    icon = 'check';
                } else if (status === 'enrolled') {
                    badgeClass = 'border-blue-500/50 bg-blue-950/30 text-blue-300';
                    statusLabel = 'مسجل';
                    icon = 'book-open';
                } else if (status === 'available') {
                    badgeClass = 'border-amber-500/50 bg-amber-950/30 text-amber-300';
                    statusLabel = 'متاح';
                    icon = 'unlock';
                }

                html += `
                    <div class="graph-node p-4 rounded-xl border ${badgeClass} hover:scale-105 transition duration-200 cursor-pointer"
                         onclick="window.prereqGraphInstance?.selectNode('${c.code}')">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="font-bold text-sm text-white">${c.code}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-semibold">${statusLabel}</span>
                        </div>
                        <div class="text-xs font-medium text-gray-200 line-clamp-1 mb-2">${c.nameAr}</div>
                        <div class="text-[11px] text-gray-400">
                            ${c.prerequisites?.length ? `متطلب: ${c.prerequisites.join(', ')}` : 'بدون متطلب'}
                        </div>
                        ${c.unlocks?.length ? `<div class="text-[10px] text-indigo-400 mt-1">يفتح: ${c.unlocks.join(', ')}</div>` : ''}
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
            <div id="prereqDetails" class="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 hidden"></div>
        `;

        this.container.innerHTML = html;
        window.prereqGraphInstance = this;
    }

    zoom(delta) {
        this.scale = Math.max(0.6, Math.min(1.5, this.scale * delta));
        const canvas = document.getElementById('graphCanvas');
        if (canvas) canvas.style.transform = `scale(${this.scale})`;
    }

    resetZoom() {
        this.scale = 1.0;
        const canvas = document.getElementById('graphCanvas');
        if (canvas) canvas.style.transform = `scale(1.0)`;
    }

    selectNode(courseCode) {
        const course = courseService.getCourseById(courseCode);
        const detailsEl = document.getElementById('prereqDetails');
        if (!detailsEl || !course) return;

        detailsEl.classList.remove('hidden');
        detailsEl.innerHTML = `
            <div class="flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">${course.code}</span>
                        <h4 class="text-lg font-bold text-white">${course.nameAr} (${course.nameEn || ''})</h4>
                    </div>
                    <p class="text-xs text-gray-300 max-w-2xl mt-1">${course.description || ''}</p>
                    <div class="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                        <span><strong class="text-white">المتطلبات السابقة:</strong> ${course.prerequisites?.length ? course.prerequisites.join(' + ') : 'لا يوجد'}</span>
                        <span><strong class="text-white">المقررات المفتوحة لاحقاً:</strong> ${course.unlocks?.length ? course.unlocks.join(', ') : 'لا يوجد'}</span>
                        <span><strong class="text-white">الساعات:</strong> ${course.creditHours}</span>
                        <span><strong class="text-white">الصعوبة:</strong> ${course.difficulty}/5</span>
                    </div>
                </div>
                <button onclick="document.getElementById('prereqDetails').classList.add('hidden')" class="text-gray-400 hover:text-white">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>
        `;
    }
}

export default PrerequisiteGraph;
