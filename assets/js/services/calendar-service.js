/**
 * Subject Search 2.0 - Academic Calendar Service
 * Loads verified JSON calendar, handles IndexedDB caching, and calculates accurate exam countdowns.
 * Provides instant 0ms fallback for zero loading delays.
 */

import { cacheManager } from '../cache/cache-manager.js';
import { STORES } from '../cache/indexeddb.js';
import { CONFIG } from '../core/config.js';

const STATIC_CALENDAR_FALLBACK = {
    "academicYear": "1447-1448H / 2026-2027G",
    "university": "جامعة الأمير مساعد بن عبدالرحمن",
    "universityEn": "Prince Musaid bin Abdulrahman University",
    "events": [
        {
            "id": "cal_evt_001",
            "type": "semester_start",
            "nameAr": "بداية الدراسة للفصل الدراسي الأول",
            "nameEn": "Commencement of Classes - Term 1",
            "startDate": "2026-08-23",
            "endDate": "2026-08-23",
            "category": "academic"
        },
        {
            "id": "cal_evt_002",
            "type": "add_drop",
            "nameAr": "فترة الحذف والإضافة للمقررات",
            "nameEn": "Course Add / Drop Period",
            "startDate": "2026-08-23",
            "endDate": "2026-08-27",
            "category": "registration"
        },
        {
            "id": "cal_evt_003",
            "type": "holiday",
            "nameAr": "إجازة اليوم الوطني السعودي",
            "nameEn": "Saudi National Day Holiday",
            "startDate": "2026-09-23",
            "endDate": "2026-09-23",
            "category": "holiday"
        },
        {
            "id": "cal_evt_004",
            "type": "midterm_exams",
            "nameAr": "بداية الاختبارات النصفية (الميدتيرم)",
            "nameEn": "Midterm Examinations Start",
            "startDate": "2026-10-18",
            "endDate": "2026-10-29",
            "category": "exam"
        },
        {
            "id": "cal_evt_005",
            "type": "course_withdrawal",
            "nameAr": "آخر موعد للاعتذار عن مقرر دراسي",
            "nameEn": "Course Withdrawal Deadline",
            "startDate": "2026-11-19",
            "endDate": "2026-11-19",
            "category": "registration"
        },
        {
            "id": "cal_evt_006",
            "type": "final_exams",
            "nameAr": "بداية الاختبارات النهائية للفصل الأول",
            "nameEn": "Final Examinations Start - Term 1",
            "startDate": "2026-11-29",
            "endDate": "2026-12-10",
            "category": "exam"
        },
        {
            "id": "cal_evt_007",
            "type": "semester_end",
            "nameAr": "نهاية الفصل الدراسي الأول وبداية إجازة منتصف العام",
            "nameEn": "End of Term 1 / Mid-Year Break",
            "startDate": "2026-12-10",
            "endDate": "2027-01-02",
            "category": "academic"
        },
        {
            "id": "cal_evt_008",
            "type": "registration",
            "nameAr": "فترة التسجيل المبكر لمقررات الفصل الثاني",
            "nameEn": "Early Course Registration - Term 2",
            "startDate": "2026-12-20",
            "endDate": "2026-12-31",
            "category": "registration"
        },
        {
            "id": "cal_evt_009",
            "type": "semester_start",
            "nameAr": "بداية الدراسة للفصل الدراسي الثاني",
            "nameEn": "Commencement of Classes - Term 2",
            "startDate": "2027-01-03",
            "endDate": "2027-01-03",
            "category": "academic"
        },
        {
            "id": "cal_evt_010",
            "type": "midterm_exams",
            "nameAr": "بداية الاختبارات النصفية للفصل الثاني",
            "nameEn": "Term 2 Midterms Start",
            "startDate": "2027-02-14",
            "endDate": "2027-02-25",
            "category": "exam"
        },
        {
            "id": "cal_evt_011",
            "type": "final_exams",
            "nameAr": "بداية الاختبارات النهائية للفصل الثاني",
            "nameEn": "Term 2 Final Examinations Start",
            "startDate": "2027-04-11",
            "endDate": "2027-04-22",
            "category": "exam"
        }
    ]
};

class CalendarService {
    constructor() {
        this.calendarData = STATIC_CALENDAR_FALLBACK;
        this.isLoaded = true; // Instant 0ms readiness
    }

    async init() {
        try {
            const data = await cacheManager.fetchWithSWR(
                'verified_calendar_v2',
                STORES.CALENDAR,
                async () => {
                    const response = await fetch(CONFIG.DATA_PATHS.ACADEMIC_CALENDAR);
                    if (!response.ok) return STATIC_CALENDAR_FALLBACK;
                    return await response.json();
                }
            );

            if (data && data.events && data.events.length > 0) {
                this.calendarData = data;
            }
            this.isLoaded = true;
            return this.calendarData;
        } catch (error) {
            console.warn('[CalendarService] Using fallback calendar:', error);
            this.calendarData = STATIC_CALENDAR_FALLBACK;
            this.isLoaded = true;
            return this.calendarData;
        }
    }

    getEvents() {
        return this.calendarData?.events || [];
    }

    getSemesters() {
        return this.calendarData?.semesters || [];
    }

    getNextEvent(type) {
        const events = this.getEvents();
        const now = new Date();
        const matching = events.filter(e => {
            if (type && e.type !== type) return false;
            const eventDate = new Date(e.startDate);
            return eventDate >= now || (e.endDate && new Date(e.endDate) >= now);
        });

        if (matching.length === 0) {
            return events.find(e => e.type === type) || null;
        }

        matching.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        return matching[0];
    }

    calculateCountdown(targetDateStr) {
        if (!targetDateStr) return null;
        const target = new Date(targetDateStr + 'T08:00:00');
        const now = new Date();
        const diffMs = target - now;

        if (diffMs <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, isPassed: false };
    }

    getCountdownSummary() {
        const finalsEvent = this.getNextEvent('final_exams');
        const midtermsEvent = this.getNextEvent('midterm_exams');
        const regEvent = this.getNextEvent('registration') || this.getNextEvent('course_withdrawal');
        const semEndEvent = this.getNextEvent('semester_end');

        return {
            finals: finalsEvent ? { event: finalsEvent, countdown: this.calculateCountdown(finalsEvent.startDate) } : null,
            midterms: midtermsEvent ? { event: midtermsEvent, countdown: this.calculateCountdown(midtermsEvent.startDate) } : null,
            registration: regEvent ? { event: regEvent, countdown: this.calculateCountdown(regEvent.startDate) } : null,
            semesterEnd: semEndEvent ? { event: semEndEvent, countdown: this.calculateCountdown(semEndEvent.startDate) } : null
        };
    }
}

export const calendarService = new CalendarService();
export default calendarService;
