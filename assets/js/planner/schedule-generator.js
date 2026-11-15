/**
 * Subject Search 2.0 - Smart Study Scheduling Engine
 * Generates realistic, balanced study distribution based on exam dates, course difficulty, and daily capacity.
 */

export class SmartScheduleGenerator {
    /**
     * Generate an optimized study timetable
     * @param {Object} options
     * @param {Array} options.enrolledCourses - Student's currently active courses
     * @param {Array} options.calendarEvents - Verified exam dates from calendarService
     * @param {number} options.dailyHoursCapacity - Max study hours per day (default 3-4 hours)
     * @param {Array} options.existingTasks - Existing student tasks to preserve completion state
     */
    static generatePlan({
        enrolledCourses = [],
        calendarEvents = [],
        dailyHoursCapacity = 3.5,
        existingTasks = [],
        startDate = new Date()
    }) {
        if (!enrolledCourses.length) return [];

        const generatedTasks = [];
        const completedTaskMap = new Map();
        existingTasks.filter(t => t.completed).forEach(t => {
            completedTaskMap.set(`${t.courseCode}_${t.date}_${t.topic}`, t);
        });

        // 1. Identify upcoming exams
        const upcomingFinals = calendarEvents.find(e => e.type === 'final_exams');
        const upcomingMidterms = calendarEvents.find(e => e.type === 'midterm_exams' && new Date(e.startDate) >= startDate);

        const examTarget = upcomingFinals || upcomingMidterms;
        const examDate = examTarget ? new Date(examTarget.startDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Days remaining until examinations
        const diffMs = examDate.getTime() - startDate.getTime();
        const availableDaysCount = Math.max(7, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        // 2. Estimate preparation workload for each course
        // Formula: Weight = (creditHours * 2) + (difficulty * 2.5)
        const courseWorkloads = enrolledCourses.map(course => {
            const credits = course.creditHours || 3;
            const diff = course.difficulty || 3.5;
            const totalHoursNeeded = Math.round((credits * 4) + (diff * 5));
            return {
                course,
                hoursNeeded: totalHoursNeeded,
                hoursScheduled: 0,
                difficulty: diff
            };
        });

        // Sort courses by difficulty descending (hardest first)
        courseWorkloads.sort((a, b) => b.difficulty - a.difficulty);

        // 3. Distribute study sessions across available days
        // Keep 2 days before exam for comprehensive revision
        const prepDaysCount = Math.max(3, availableDaysCount - 2);

        for (let dayOffset = 0; dayOffset < prepDaysCount; dayOffset++) {
            const currentDay = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
            const dateStr = currentDay.toISOString().split('T')[0];
            let dayHoursAllocated = 0;

            // Pick up to 2 distinct courses per day to avoid burnout
            for (const cw of courseWorkloads) {
                if (cw.hoursScheduled >= cw.hoursNeeded) continue;
                if (dayHoursAllocated + 1.5 > dailyHoursCapacity) break;

                const sessionDuration = 1.5; // 1.5 hours focused study slot
                const sessionIndex = Math.floor(cw.hoursScheduled / 1.5) + 1;
                const topic = `جلسة استذكار ${sessionIndex}: مراجعة المفاهيم والتمارين`;

                const taskKey = `${cw.course.code}_${dateStr}_${topic}`;
                const isAlreadyDone = completedTaskMap.has(taskKey);

                generatedTasks.push({
                    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    courseCode: cw.course.code,
                    courseName: cw.course.nameAr,
                    date: dateStr,
                    durationHours: sessionDuration,
                    topic: topic,
                    type: 'study_session',
                    completed: isAlreadyDone,
                    difficulty: cw.difficulty
                });

                cw.hoursScheduled += sessionDuration;
                dayHoursAllocated += sessionDuration;
            }
        }

        // 4. Add Final Revision sessions on the final 2 days
        for (let revOffset = prepDaysCount; revOffset < availableDaysCount; revOffset++) {
            const revDay = new Date(startDate.getTime() + revOffset * 24 * 60 * 60 * 1000);
            const revDateStr = revDay.toISOString().split('T')[0];

            enrolledCourses.forEach(course => {
                generatedTasks.push({
                    id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    courseCode: course.code,
                    courseName: course.nameAr,
                    date: revDateStr,
                    durationHours: 1.0,
                    topic: `مراجعة شاملة ليلة الاختبار وحل النماذج السابقة`,
                    type: 'exam_revision',
                    completed: false,
                    difficulty: course.difficulty || 3.5
                });
            });
        }

        return generatedTasks;
    }

    /**
     * Reschedule incomplete past tasks into remaining future days
     */
    static rescheduleIncompleteTasks(tasks, dailyCapacity = 3.5) {
        const todayStr = new Date().toISOString().split('T')[0];
        const futureTasks = [];
        const overdueIncomplete = [];

        tasks.forEach(t => {
            if (!t.completed && t.date < todayStr) {
                overdueIncomplete.push(t);
            } else {
                futureTasks.push(t);
            }
        });

        // Reallocate overdue tasks to tomorrow onwards
        let nextDayOffset = 1;
        overdueIncomplete.forEach(t => {
            const nextDate = new Date(Date.now() + nextDayOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            t.date = nextDate;
            t.topic = `[معاد جدولته] ${t.topic}`;
            futureTasks.push(t);
            nextDayOffset++;
        });

        futureTasks.sort((a, b) => a.date.localeCompare(b.date));
        return futureTasks;
    }
}

export default SmartScheduleGenerator;
