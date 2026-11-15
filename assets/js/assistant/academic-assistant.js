/**
 * Subject Search 2.0 - AI-Free Deterministic Academic Assistant
 * Zero paid APIs! Uses NLP intent classification, entity extraction, and live catalog retrieval.
 */

import { courseService } from '../services/course-service.js';
import { calendarService } from '../services/calendar-service.js';
import { plannerEngine } from '../planner/planner-engine.js';
import { normalizeArabic } from '../search/synonyms.js';

export class AcademicAssistant {
    /**
     * Parse message and return structured response
     */
    static processMessage(message) {
        if (!message || !message.trim()) return null;
        const norm = normalizeArabic(message);

        // 1. Detect Intent
        // Intent: Countdown / Exams / Dates
        if (norm.includes('فاينل') || norm.includes('ميد') || norm.includes('اختبار') || norm.includes('تقويم') || norm.includes('كم باقي')) {
            return this.handleCalendarQuery(norm);
        }

        // Intent: Prerequisite Query
        if (norm.includes('متطلب') || norm.includes('افتح') || norm.includes('قبل') || norm.includes('بعد')) {
            return this.handlePrerequisiteQuery(norm, message);
        }

        // Intent: Compare courses
        if (norm.includes('قارن') || norm.includes('مقارنه') || norm.includes('الفرق بين')) {
            return this.handleCompareQuery(norm, message);
        }

        // Intent: Course Difficulty / Recommendations
        if (norm.includes('اصعب') || norm.includes('اسهل') || norm.includes('نصيحه') || norm.includes('تنصحني')) {
            return this.handleRecommendationQuery(norm);
        }

        // Intent: Study Schedule / Planner
        if (norm.includes('جدول') || norm.includes('مذاكره') || norm.includes('تخطيط') || norm.includes('خطة')) {
            return this.handlePlannerQuery();
        }

        // Fallback: Course lookup by code/keywords
        return this.handleCourseLookup(norm, message);
    }

    static handleCalendarQuery(norm) {
        const summary = calendarService.getCountdownSummary();
        const nextExam = summary.finals || summary.midterms;

        if (nextExam && nextExam.countdown && !nextExam.countdown.isPast) {
            const days = nextExam.countdown.days;
            return {
                text: `📅 **متابعة التقويم الأكاديمي:**\n\nباقي **${days} يوم** على موعد ${nextExam.event.nameAr} (يبدأ في ${nextExam.event.startDate}).\n\nهل ترغب في توليد جدول مذاكرة ذكي لتوزيع ساعات الاستذكار على هذه الفترة؟`,
                action: 'open_calendar',
                actionLabel: 'استعراض التقويم الأكاديمي'
            };
        }

        return {
            text: `📅 **التقويم الأكاديمي لجامعة SEU:**\n\nجميع المواعيد الرسمية المعتمدة للاختبارات النصفية والنهائية وفترات الحذف والإضافة متوفرة ومحدثة دورياً في قسم التقويم.`,
            action: 'open_calendar',
            actionLabel: 'الانتقال للتقويم'
        };
    }

    static handlePrerequisiteQuery(norm, raw) {
        // Find mentioned course codes in query (e.g. CS230, DS 230, LAW 101)
        const match = raw.match(/([a-zA-Z]{2,4})\s*(\d{3})/i);
        if (match) {
            const courseCode = `${match[1].toUpperCase()} ${match[2]}`;
            const course = courseService.getCourseById(courseCode);

            if (course) {
                const prereqs = course.prerequisites?.length ? course.prerequisites.join(', ') : 'لا يوجد متطلب سابق (متاح للتسجيل مباشرة)';
                const unlocks = course.unlocks?.length ? course.unlocks.join(', ') : 'لا يفتح مقررات لاحقة حالياً';

                return {
                    text: `🔍 **المسار الأكاديمي لمقرر ${course.code} (${course.nameAr}):**\n\n* **المتطلب السابق:** ${prereqs}\n* **المقررات التي يفتحها لاحقاً:** ${unlocks}\n* **الساعات المعتمدة:** ${course.creditHours} ساعات (المستوى ${course.level})`,
                    action: 'open_prereq_graph',
                    actionLabel: 'مشاهدة شجرة المتطلبات التفاعلية'
                };
            }
        }

        return {
            text: `للاستعلام عن المتطلبات السابقة، اذكر رمز المقرر (مثال: متطلبات CS230 أو ماذا يفتح LAW101) أو تفضل بزيارة شجرة المتطلبات التفاعلية بالمنصة.`,
            action: 'open_prereq_graph',
            actionLabel: 'فتح شجرة المتطلبات'
        };
    }

    static handleCompareQuery(norm, raw) {
        const matches = [...raw.matchAll(/([a-zA-Z]{2,4})\s*(\d{3})/gi)];
        if (matches.length >= 2) {
            const code1 = `${matches[0][1].toUpperCase()} ${matches[0][2]}`;
            const code2 = `${matches[1][1].toUpperCase()} ${matches[1][2]}`;
            const c1 = courseService.getCourseById(code1);
            const c2 = courseService.getCourseById(code2);

            if (c1 && c2) {
                return {
                    text: `⚖️ **مقارنة سريعة بين ${c1.code} و ${c2.code}:**\n\n* **${c1.code} (${c1.nameAr}):** الصعوبة ${c1.difficulty}/5 • التقييم ${c1.rating}/5 • المتطلب: ${c1.prerequisites?.join(',') || 'لا يوجد'}\n* **${c2.code} (${c2.nameAr}):** الصعوبة ${c2.difficulty}/5 • التقييم ${c2.rating}/5 • المتطلب: ${c2.prerequisites?.join(',') || 'لا يوجد'}\n\nيمكنك استخدام أداة المقارنة المتقدمة للمزيد من التفاصيل.`,
                    action: 'open_compare',
                    actionLabel: 'مقارنة شاملة في مصفوفة المقررات'
                };
            }
        }

        return {
            text: `لمقارنة مقررين، اذكر الرمزين في رسالتك مثل: (قارن بين CS230 و CS240) أو تفضل بزيارة قسم مقارنة المقررات.`,
            action: 'open_compare',
            actionLabel: 'فتح أداة المقارنة'
        };
    }

    static handleRecommendationQuery(norm) {
        const all = courseService.getAllCourses();
        const hardest = [...all].sort((a, b) => b.difficulty - a.difficulty).slice(0, 3);
        const highestRated = [...all].sort((a, b) => b.rating - a.rating).slice(0, 3);

        if (norm.includes('اصعب')) {
            const list = hardest.map(c => `• **${c.code}** (${c.nameAr}) - معدل صعوبة ${c.difficulty}/5`).join('\n');
            return {
                text: `📊 **أكثر المقررات تحدياً بناءً على تقييمات الطلاب:**\n\n${list}\n\nنصيحة: احرص على تخصيص ساعات إضافية في خطتك الدراسية لهذه المقررات وتجنب تسجيلها معاً في فصل واحد إن أمكن.`,
                action: 'open_planner',
                actionLabel: 'تخطيط الجدول الدراسي'
            };
        }

        const topList = highestRated.map(c => `• **${c.code}** (${c.nameAr}) - تقييم ${c.rating}/5`).join('\n');
        return {
            text: `⭐ **أعلى المقررات تقييماً من الطلاب:**\n\n${topList}`,
            action: 'open_courses',
            actionLabel: 'استعراض المقررات'
        };
    }

    static handlePlannerQuery() {
        const profile = plannerEngine.getProfile();
        const progress = plannerEngine.getProgress();

        return {
            text: `🎯 **حالتك الأكاديمية والخطة الدراسية:**\n\n* **المقررات المكتملة:** ${progress.completedCount} مقرر (${progress.earnedCredits} ساعة معتمدة)\n* **المقررات المسجلة حالياً:** ${progress.enrolledCount} مقرر\n* **نسبة الإنجاز نحو التخرج:** ${progress.percentage}%\n\nمحرك الجدولة الذكي جاهز لتوزيع جلسات استذكارك تلقائياً ومراعاة مواعيد الاختبارات القادمة.`,
            action: 'open_planner',
            actionLabel: 'الانتقال إلى المخطط الأكاديمي'
        };
    }

    static handleCourseLookup(norm, raw) {
        const match = raw.match(/([a-zA-Z]{2,4})\s*(\d{3})/i);
        if (match) {
            const code = `${match[1].toUpperCase()} ${match[2]}`;
            const course = courseService.getCourseById(code);
            if (course) {
                return {
                    text: `📘 **مقرر ${course.code} - ${course.nameAr}:**\n\n${course.description || 'مقرر معتمد بالجامعة'}\n\n* **الكلية:** ${course.collegeNameAr}\n* **الساعات:** ${course.creditHours} معتمدة\n* **التقييم:** ${course.rating}/5 (من ${course.reviewCount} مراجعة)`,
                    action: 'open_courses',
                    actionLabel: 'عرض بطاقة المقرر'
                };
            }
        }

        return {
            text: `مرحباً بك! أنا مساعد Subject Search 2.0 الأكاديمي.\n\nيمكنني مساعدتك في:\n1. استعلام متطلبات أي مقرر وما يفتحه (مثال: متطلبات CS230)\n2. مقارنة مقررين جنباً إلى جنب (مثال: قارن بين CS230 و CS240)\n3. معرفة الأيام المتبقية حتى الاختبارات النهائية والتقويم الجامعي\n4. تنظيم وموازنة خطتك الدراسية`,
            action: null
        };
    }
}

export default AcademicAssistant;
