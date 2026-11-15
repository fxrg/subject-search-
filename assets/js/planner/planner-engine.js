/**
 * Subject Search 2.0 - Academic Planner Engine
 * Manages student academic profile, course status, semester goals, and schedule state.
 */

import { idbStorage, STORES } from '../cache/indexeddb.js';
import { SmartScheduleGenerator } from './schedule-generator.js';
import { calendarService } from '../services/calendar-service.js';
import { courseService } from '../services/course-service.js';

const PROFILE_KEY = 'student_academic_profile';

export class PlannerEngine {
    constructor() {
        this.profile = {
            major: 'cs',
            level: 3,
            completedCourses: ['CS 230', 'ENG 101'],
            enrolledCourses: ['CS 240', 'CS 350'],
            plannedCourses: ['CS 351', 'CS 360'],
            dailyHoursCapacity: 3.5,
            totalCreditsRequired: 128
        };
        this.tasks = [];
        this.isLoaded = false;
    }

    async init() {
        // Load profile from IndexedDB or local storage
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

    getProfile() {
        return this.profile;
    }

    /**
     * Calculate academic completion metrics
     */
    getProgress() {
        const completedCount = this.profile.completedCourses.length;
        const enrolledCount = this.profile.enrolledCourses.length;
        const plannedCount = this.profile.plannedCourses.length;

        // Estimate completed credit hours (assuming ~3 credits per course)
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
        // status: 'completed' | 'enrolled' | 'planned' | 'none'
        const code = courseCode.trim();

        this.profile.completedCourses = this.profile.completedCourses.filter(c => c !== code);
        this.profile.enrolledCourses = this.profile.enrolledCourses.filter(c => c !== code);
        this.profile.plannedCourses = this.profile.plannedCourses.filter(c => c !== code);

        if (status === 'completed') this.profile.completedCourses.push(code);
        else if (status === 'enrolled') this.profile.enrolledCourses.push(code);
        else if (status === 'planned') this.profile.plannedCourses.push(code);

        await this.saveProfile(this.profile);
    }

    /**
     * Trigger smart study schedule regeneration
     */
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
