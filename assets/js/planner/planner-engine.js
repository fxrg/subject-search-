/**
 * Subject Search 2.0 - Academic Degree Planner & Exam Schedule Engine
 * Adapted from SEU-Planner curriculum matrix, prerequisite validation, credit calculator,
 * and local-first Exam Date/Time countdown tracker (100% IndexedDB, Zero Firebase Quota).
 */

import { idbStorage, STORES } from '../cache/indexeddb.js';
import { SmartScheduleGenerator } from './schedule-generator.js';
import { calendarService } from '../services/calendar-service.js';
import { courseService } from '../services/course-service.js';

const PROFILE_KEY = 'student_academic_profile';
const DEGREE_PLAN_KEY_PREFIX = 'seu_degree_plan_';
const STUDY_SCHEDULE_KEY_PREFIX = 'seu_study_schedule_';

export const INTENSITY_CONFIG = {
    light: { label: 'خفيف — ساعتان يومياً (جلسة واحدة)', hoursPerDay: 2, sessionsPerDay: 1, maxMinutes: 120 },
    medium: { label: 'متوسط — 4 ساعات يومياً (جلستان)', hoursPerDay: 4, sessionsPerDay: 2, maxMinutes: 240 },
    intensive: { label: 'مكثف — 6 ساعات يومياً (3 جلسات)', hoursPerDay: 6, sessionsPerDay: 3, maxMinutes: 360 }
};

const SESSION_TYPE_AR = {
    reading: 'قراءة ومذاكرة',
    practice: 'تطبيق عملي',
    review: 'مراجعة',
    quiz: 'اختبار تجريبي',
    'final-review': 'مراجعة نهائية'
};

export const COURSE_STATUS = {
    REMAINING: 'remaining',
    REGISTERED: 'registered',
    COMPLETED: 'completed'
};

export function normalizeCourseCode(code) {
    return String(code || '').replace(/\s+/g, '').toUpperCase();
}

/**
 * Evaluate whether a course's prerequisites (including the Prep-Year Level 1-2 gate) are satisfied
 * by the set of completed course codes.
 */
export function evaluateCourseUnlockState(course, levelNumber, completedSet, prepCourseCodes = []) {
    const code = normalizeCourseCode(course?.code);
    const lvl = Number(levelNumber) || 1;
    const isCompleted = completedSet.has(code);

    const missingPrep = lvl >= 3
        ? prepCourseCodes.map(normalizeCourseCode).filter(p => p && !completedSet.has(p))
        : [];
    const directPrereqs = (course?.prerequisites || []).map(normalizeCourseCode).filter(Boolean);
    const missingDirect = directPrereqs.filter(p => !completedSet.has(p));

    const isUnlocked = missingPrep.length === 0 && missingDirect.length === 0;
    return {
        code,
        isCompleted,
        isUnlocked,
        missingPrepCount: missingPrep.length,
        missingDirect
    };
}

/**
 * Calculate live credit hour summary across all levels of a major degree plan.
 * Excludes any study-session / Pomodoro logic; strictly computes degree credit hours.
 */
export function calculateDegreePlanCredits(majorPlan, courseStates = {}) {
    const levels = majorPlan?.levels || {};
    let completedCredits = 0;
    let registeredCredits = 0;
    let totalCredits = 0;
    let completedCoursesCount = 0;
    let registeredCoursesCount = 0;
    let remainingCoursesCount = 0;

    for (const courses of Object.values(levels)) {
        for (const course of (courses || [])) {
            const code = normalizeCourseCode(course.code);
            const credits = Number(course.creditHours ?? course.credits) || 3;
            totalCredits += credits;

            const status = courseStates[code] || COURSE_STATUS.REMAINING;
            if (status === COURSE_STATUS.COMPLETED) {
                completedCredits += credits;
                completedCoursesCount += 1;
            } else if (status === COURSE_STATUS.REGISTERED) {
                registeredCredits += credits;
                registeredCoursesCount += 1;
            } else {
                remainingCoursesCount += 1;
            }
        }
    }

    const remainingCredits = Math.max(0, totalCredits - completedCredits - registeredCredits);
    const completionPercentage = totalCredits > 0
        ? Math.min(100, Math.round((completedCredits / totalCredits) * 100))
        : 0;
    const registeredPercentage = totalCredits > 0
        ? Math.min(100 - completionPercentage, Math.round((registeredCredits / totalCredits) * 100))
        : 0;

    return {
        totalCredits,
        completedCredits,
        registeredCredits,
        remainingCredits,
        completedCoursesCount,
        registeredCoursesCount,
        remainingCoursesCount,
        completionPercentage,
        registeredPercentage,
        estimatedRemainingSemesters: Math.ceil((totalCredits - completedCredits) / 16)
    };
}

/**
 * Compute live countdown details from a reference date/time to an exam date/time.
 */
export function computeExamCountdown(examDateStr, examTimeStr = '09:00', now = new Date()) {
    if (!examDateStr) return null;
    const cleanTime = /^\d{2}:\d{2}$/.test(String(examTimeStr || '').trim())
        ? String(examTimeStr).trim()
        : '09:00';
    const target = new Date(`${examDateStr}T${cleanTime}:00`);
    if (isNaN(target.getTime())) return null;

    const diffMs = target.getTime() - now.getTime();
    const isPast = diffMs < 0;
    const absMs = Math.abs(diffMs);
    const totalHours = Math.floor(absMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));

    let badgeText = '';
    let urgency = 'normal'; // 'past' | 'urgent' | 'soon' | 'normal'

    if (isPast) {
        badgeText = days > 0 ? `انقضى منذ ${days} يوم` : 'انقضى اليوم';
        urgency = 'past';
    } else if (days === 0 && hours === 0) {
        badgeText = `اليوم! باقي ${Math.max(1, minutes)} دقيقة`;
        urgency = 'urgent';
    } else if (days === 0) {
        badgeText = `اليوم! باقي ${hours} ساعة`;
        urgency = 'urgent';
    } else if (days < 7) {
        badgeText = hours > 0 ? `باقي ${days} يوم و ${hours} ساعة` : `باقي ${days} يوم`;
        urgency = 'urgent';
    } else if (days <= 21) {
        badgeText = hours > 0 ? `باقي ${days} يوم و ${hours} ساعة` : `باقي ${days} يوم`;
        urgency = 'soon';
    } else {
        badgeText = `باقي ${days} يوم`;
        urgency = 'normal';
    }

    return {
        timestamp: target.getTime(),
        isPast,
        days,
        hours,
        minutes,
        badgeText,
        urgency
    };
}

/**
 * Build a chronologically sorted timeline of all scheduled Midterm and Final exams.
 */
export function buildUpcomingExamsTimeline(examSchedules = {}, courseLookup = {}, now = new Date()) {
    const entries = [];

    for (const [rawCode, sched] of Object.entries(examSchedules || {})) {
        if (!sched || typeof sched !== 'object') continue;
        const code = normalizeCourseCode(rawCode);
        const courseInfo = courseLookup[code] || { code, nameAr: sched.courseName || code };

        if (sched.midtermDate) {
            const countdown = computeExamCountdown(sched.midtermDate, sched.midtermTime || '09:00', now);
            if (countdown) {
                entries.push({
                    id: `${code}-midterm`,
                    courseCode: code,
                    courseName: courseInfo.nameAr || code,
                    examType: 'midterm',
                    examTypeLabel: 'اختبار الميد (Midterm)',
                    date: sched.midtermDate,
                    time: sched.midtermTime || '09:00',
                    period: sched.midtermPeriod || sched.period || '',
                    ...countdown
                });
            }
        }

        if (sched.finalDate) {
            const countdown = computeExamCountdown(sched.finalDate, sched.finalTime || '09:00', now);
            if (countdown) {
                entries.push({
                    id: `${code}-final`,
                    courseCode: code,
                    courseName: courseInfo.nameAr || code,
                    examType: 'final',
                    examTypeLabel: 'الاختبار النهائي (Final)',
                    date: sched.finalDate,
                    time: sched.finalTime || '09:00',
                    period: sched.finalPeriod || sched.period || '',
                    ...countdown
                });
            }
        }
    }

    // Sort upcoming exams first (nearest to furthest), then past exams
    return entries.sort((a, b) => {
        if (a.isPast !== b.isPast) return a.isPast ? 1 : -1;
        return a.timestamp - b.timestamp;
    });
}

function toIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function assignSequentialTimesPerDay(sessions, startTime = '09:00', breakMinutes = 15) {
    const byDate = {};
    sessions.forEach(s => {
        (byDate[s.scheduled_date] ||= []).push(s);
    });

    const [startH, startM] = String(startTime || '09:00').split(':').map(Number);
    const baseMinutes = (Number.isFinite(startH) ? startH : 9) * 60 + (Number.isFinite(startM) ? startM : 0);

    const minutesToTime = mins => {
        const clamped = Math.min(23 * 60 + 55, Math.max(0, mins));
        const h = Math.floor(clamped / 60).toString().padStart(2, '0');
        const m = (clamped % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    Object.keys(byDate).forEach(date => {
        let cursor = baseMinutes;
        byDate[date].forEach(s => {
            s.scheduled_time = minutesToTime(cursor);
            cursor += (s.duration_minutes || 60) + breakMinutes;
        });
    });
    return sessions;
}

/**
 * Adapted from SEU-Planner (StudyPlanner.generatePlan):
 * Distributes 13 modules per course (reading 60m, practice 90m, review every 3 modules 45m)
 * plus 3-day pre-exam final review sessions, respecting daily capacity and sequential times.
 */
export function generateSeuStudySchedule({
    courses = [],
    intensity = 'medium',
    startTime = '09:00',
    modulesPerCourse = 13,
    defaultEndDate = '',
    examSchedules = {},
    startDate = new Date()
} = {}) {
    if (!Array.isArray(courses) || courses.length === 0) {
        throw new Error('اختر مادة واحدة على الأقل لبناء جدول المذاكرة.');
    }

    const config = INTENSITY_CONFIG[intensity] || INTENSITY_CONFIG.medium;
    const today = new Date(startDate);
    today.setHours(0, 0, 0, 0);

    // The study plan must finish before the first exam among the selected courses.
    let targetEnd = defaultEndDate ? new Date(`${defaultEndDate}T00:00:00`) : null;
    const selectedExamDates = courses
        .map(course => examSchedules[normalizeCourseCode(course.code)] || {})
        .flatMap(schedule => [schedule.midtermDate, schedule.finalDate])
        .filter(Boolean)
        .map(date => new Date(`${date}T00:00:00`))
        .filter(date => !isNaN(date.getTime()) && date > today)
        .sort((a, b) => a - b);
    const firstExamDate = selectedExamDates[0] || null;
    if (firstExamDate && (!targetEnd || isNaN(targetEnd.getTime()) || targetEnd > firstExamDate)) {
        targetEnd = new Date(firstExamDate);
    }
    if (!targetEnd || isNaN(targetEnd.getTime()) || targetEnd <= today) {
        targetEnd = new Date(today);
        targetEnd.setDate(targetEnd.getDate() + 45);
    }

    const daysAvailable = Math.max(1, Math.floor((targetEnd - today) / (1000 * 60 * 60 * 24)));
    const studyWindowDays = Math.max(1, daysAvailable - 3);
    const schedule = {};
    const scheduleDates = [];

    for (let day = 0; day < studyWindowDays; day += 1) {
        const d = new Date(today);
        d.setDate(d.getDate() + day);
        const dateStr = toIsoDate(d);
        scheduleDates.push(dateStr);
        schedule[dateStr] = { sessions: [], totalMinutes: 0, maxMinutes: config.maxMinutes };
    }

    const sessions = [];
    let sessionId = 1;
    const totalModules = Math.max(1, Math.min(20, Number(modulesPerCourse) || 13));

    const tryScheduleSession = (preferredIdx, course, moduleNumber, type, duration) => {
        for (let offset = 0; offset < scheduleDates.length; offset += 1) {
            const idx = (preferredIdx + offset) % scheduleDates.length;
            const dateStr = scheduleDates[idx];
            const bucket = schedule[dateStr];
            if (bucket && (bucket.totalMinutes + duration) <= bucket.maxMinutes) {
                const session = {
                    id: sessionId++,
                    course_code: normalizeCourseCode(course.code),
                    course_name_ar: course.nameAr || course.name_ar || course.code,
                    module_number: moduleNumber,
                    session_type: type,
                    session_type_ar: SESSION_TYPE_AR[type] || type,
                    duration_minutes: duration,
                    scheduled_date: dateStr,
                    scheduled_time: startTime,
                    is_completed: false,
                    is_final_review: false,
                    notes: `${SESSION_TYPE_AR[type] || type} - الموديول ${moduleNumber}`
                };
                bucket.sessions.push(session);
                bucket.totalMinutes += duration;
                sessions.push(session);
                return idx + 1;
            }
        }
        return preferredIdx + 1;
    };

    courses.forEach((course, courseIdx) => {
        let dayCursor = courseIdx % Math.max(1, Math.min(3, scheduleDates.length));
        for (let mod = 1; mod <= totalModules; mod += 1) {
            dayCursor = tryScheduleSession(dayCursor, course, mod, 'reading', 60);
            dayCursor = tryScheduleSession(dayCursor, course, mod, 'practice', 90);
            if (mod % 3 === 0) {
                dayCursor = tryScheduleSession(dayCursor, course, mod, 'review', 45);
            }
        }
    });

    // Add 3-day Final Review sessions before each course's scheduled Final or Midterm exam
    courses.forEach(course => {
        const code = normalizeCourseCode(course.code);
        const sched = examSchedules[code] || {};
        const examDateStr = sched.finalDate || sched.midtermDate || toIsoDate(targetEnd);
        const examDate = new Date(`${examDateStr}T00:00:00`);
        if (isNaN(examDate.getTime())) return;

        for (let dayBefore = 3; dayBefore >= 1; dayBefore -= 1) {
            const reviewDate = new Date(examDate);
            reviewDate.setDate(reviewDate.getDate() - dayBefore);
            if (reviewDate < today) continue;

            const sessionType = dayBefore === 3 ? 'review' : (dayBefore === 2 ? 'quiz' : 'final-review');
            const duration = dayBefore === 1 ? 120 : 90;
            sessions.push({
                id: 10000 + sessionId++,
                course_code: code,
                course_name_ar: course.nameAr || course.name_ar || code,
                module_number: null,
                session_type: sessionType,
                session_type_ar: SESSION_TYPE_AR[sessionType] || sessionType,
                duration_minutes: duration,
                scheduled_date: toIsoDate(reviewDate),
                scheduled_time: startTime,
                is_completed: false,
                is_final_review: true,
                notes: dayBefore === 1
                    ? `مراجعة نهائية شاملة لـ ${course.nameAr || code} — يوم واحد قبل الاختبار!`
                    : `مراجعة مكثفة لـ ${course.nameAr || code} — ${dayBefore} أيام قبل الاختبار`
            });
        }
    });

    sessions.sort((a, b) => {
        const dateDiff = a.scheduled_date.localeCompare(b.scheduled_date);
        if (dateDiff !== 0) return dateDiff;
        const codeDiff = a.course_code.localeCompare(b.course_code);
        if (codeDiff !== 0) return codeDiff;
        return (a.module_number || 99) - (b.module_number || 99);
    });

    assignSequentialTimesPerDay(sessions, startTime, 15);

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    return {
        id: Date.now(),
        courses: courses.map(c => ({ code: normalizeCourseCode(c.code), nameAr: c.nameAr || c.code })),
        sessions,
        intensity,
        start_time: startTime,
        modules_per_course: totalModules,
        created_at: new Date().toISOString(),
        start_date: toIsoDate(today),
        end_date: toIsoDate(targetEnd),
        total_sessions: sessions.length,
        total_study_hours: Math.round(totalMinutes / 60),
        hours_per_day: config.hoursPerDay
    };
}

export class PlannerEngine {
    constructor() {
        this.profile = {
            collegeId: 'computing',
            major: 'cs',
            level: 3,
            completedCourses: ['CS 230', 'ENG 101'],
            enrolledCourses: ['CS 240', 'CS 350'],
            plannedCourses: ['CS 351', 'CS 360'],
            courseStates: {},
            examSchedules: {},
            dailyHoursCapacity: 3.5,
            totalCreditsRequired: 130
        };
        this.tasks = [];
        this.isLoaded = false;
    }

    async init() {
        try {
            const cachedProfile = await idbStorage.get(STORES.META, PROFILE_KEY);
            if (cachedProfile && cachedProfile.data) {
                this.profile = { ...this.profile, ...cachedProfile.data };
            }
            this.tasks = await idbStorage.getAll(STORES.PLANNER_TASKS);
            this.isLoaded = true;
        } catch (e) {
            console.warn('[PlannerEngine] Fallback loading profile:', e);
            this.isLoaded = true;
        }
    }

    async saveProfile(newProfile) {
        this.profile = { ...this.profile, ...newProfile };
        await idbStorage.set(STORES.META, { key: PROFILE_KEY, data: this.profile });
    }

    async loadMajorPlanState(majorId) {
        const key = `${DEGREE_PLAN_KEY_PREFIX}${String(majorId || 'cs').toLowerCase()}`;
        try {
            const record = await idbStorage.get(STORES.META, key);
            if (record && record.data) return record.data;
        } catch (e) {
            console.warn('[PlannerEngine] IndexedDB loadMajorPlanState fallback:', e);
        }
        return null;
    }

    async saveMajorPlanState(majorId, stateData) {
        const key = `${DEGREE_PLAN_KEY_PREFIX}${String(majorId || 'cs').toLowerCase()}`;
        await idbStorage.set(STORES.META, {
            key,
            data: {
                ...stateData,
                updatedAt: new Date().toISOString()
            }
        });
    }

    async loadStudySchedule(majorId) {
        const key = `${STUDY_SCHEDULE_KEY_PREFIX}${String(majorId || 'cs').toLowerCase()}`;
        try {
            const record = await idbStorage.get(STORES.META, key);
            if (record && record.data) return record.data;
        } catch (e) {
            console.warn('[PlannerEngine] IndexedDB loadStudySchedule fallback:', e);
        }
        return null;
    }

    async saveStudySchedule(majorId, scheduleData) {
        const key = `${STUDY_SCHEDULE_KEY_PREFIX}${String(majorId || 'cs').toLowerCase()}`;
        await idbStorage.set(STORES.META, {
            key,
            data: scheduleData
        });
    }

    getProfile() {
        return this.profile;
    }

    getProgress() {
        const completedCount = this.profile.completedCourses.length;
        const enrolledCount = this.profile.enrolledCourses.length;
        const plannedCount = this.profile.plannedCourses.length;

        const earnedCredits = completedCount * 3;
        const enrolledCredits = enrolledCount * 3;
        const percentage = Math.min(100, Math.round((earnedCredits / this.profile.totalCreditsRequired) * 100));

        return {
            completedCount,
            enrolledCount,
            plannedCount,
            earnedCredits,
            enrolledCredits,
            totalCreditsRequired: this.profile.totalCreditsRequired,
            percentage
        };
    }

    async setCourseStatus(courseCode, status) {
        const code = courseCode.trim();

        this.profile.completedCourses = this.profile.completedCourses.filter(c => c !== code);
        this.profile.enrolledCourses = this.profile.enrolledCourses.filter(c => c !== code);
        this.profile.plannedCourses = this.profile.plannedCourses.filter(c => c !== code);

        if (status === 'completed') this.profile.completedCourses.push(code);
        else if (status === 'enrolled' || status === 'registered') this.profile.enrolledCourses.push(code);
        else if (status === 'planned') this.profile.plannedCourses.push(code);

        await this.saveProfile(this.profile);
    }

    async generateSmartSchedule() {
        const enrolledCourseObjects = this.profile.enrolledCourses
            .map(code => courseService.getCourseById(code))
            .filter(Boolean);

        const events = calendarService.getEvents();
        const newTasks = SmartScheduleGenerator.generatePlan({
            enrolledCourses: enrolledCourseObjects,
            calendarEvents: events,
            dailyHoursCapacity: this.profile.dailyHoursCapacity || 3.5,
            existingTasks: this.tasks
        });

        this.tasks = newTasks;
        await idbStorage.clear(STORES.PLANNER_TASKS);
        await idbStorage.setMany(STORES.PLANNER_TASKS, this.tasks);
        return this.tasks;
    }

    async toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            await idbStorage.set(STORES.PLANNER_TASKS, task);
        }
        return task;
    }

    async rescheduleTasks() {
        this.tasks = SmartScheduleGenerator.rescheduleIncompleteTasks(this.tasks, this.profile.dailyHoursCapacity);
        await idbStorage.clear(STORES.PLANNER_TASKS);
        await idbStorage.setMany(STORES.PLANNER_TASKS, this.tasks);
        return this.tasks;
    }

    getTasksForDate(dateStr) {
        return this.tasks.filter(t => t.date === dateStr);
    }

    getAllTasks() {
        return this.tasks;
    }
}

export const plannerEngine = new PlannerEngine();
export default plannerEngine;
