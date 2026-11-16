/**
 * Subject Search 2.0 - Automated Test Suite
 * Validates search, fuzzy matching, calendar countdowns, prerequisites, scheduling, and duplicate review prevention.
 */

import assert from 'assert';
import { FuzzySearch } from '../assets/js/search/fuzzy-search.js';
import { normalizeArabic, getSynonymsForQuery } from '../assets/js/search/synonyms.js';
import { SmartScheduleGenerator } from '../assets/js/planner/schedule-generator.js';
import {
    COURSE_STATUS,
    evaluateCourseUnlockState,
    calculateDegreePlanCredits,
    computeExamCountdown,
    buildUpcomingExamsTimeline,
    generateSeuStudySchedule
} from '../assets/js/planner/planner-engine.js';
import { PrerequisiteGraph } from '../assets/js/courses/prerequisite-graph.js';
import { parseMarkdownCourse, cleanSource, normalizeBullets } from '../js/md-parser.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('🧪 Starting Subject Search 2.0 Test Suite');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  ✅ [PASS] ${description}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ [FAIL] ${description}`);
        console.error(`     Error: ${err.message}`);
    }
}

// ----------------------------------------------------
// 1. Text Normalization & Synonyms Tests
// ----------------------------------------------------
console.log('🔹 1. Arabic & English Normalization & Synonym Expansion:');

test('Normalizes Arabic letters (alef, yaa, ta marbuta, tashkeel)', () => {
    const raw = 'إِسْتِذْكَارُ قَوَاعِدِ البَيَانَاتِ ومُقَرَّرَاتِهَا!';
    const norm = normalizeArabic(raw);
    assert.strictEqual(norm.includes('استذكار'), true);
    assert.strictEqual(norm.includes('بيانات'), true);
});

test('Expands academic synonyms (e.g. ذكاء اصطناعي -> machine learning, deep learning)', () => {
    const synonyms = getSynonymsForQuery('ذكاء اصطناعي');
    assert.strictEqual(synonyms.includes('ai'), true);
    assert.strictEqual(synonyms.includes('machine learning'), true);
    assert.strictEqual(synonyms.includes('تعلم الي'), true);
});

// ----------------------------------------------------
// 2. Fuzzy Search & Typo Tolerance Tests
// ----------------------------------------------------
console.log('\n🔹 2. Fuzzy Search & Typo Tolerance:');

test('Levenshtein distance calculation', () => {
    assert.strictEqual(FuzzySearch.levenshtein('kitten', 'sitting'), 3);
    assert.strictEqual(FuzzySearch.levenshtein('قانون', 'قانون'), 0);
    assert.strictEqual(FuzzySearch.levenshtein('قانون', 'قوانين'), 2);
});

test('Matches with typos (e.g., برمجية vs برمجة)', () => {
    assert.strictEqual(FuzzySearch.matchesWithTypo('برمجة الحاسب', 'برمجه'), true);
    assert.strictEqual(FuzzySearch.matchesWithTypo('Object Oriented Programming', 'progamming'), true);
});

// ----------------------------------------------------
// 3. Prerequisite Graph & Circular Dependency Detection
// ----------------------------------------------------
console.log('\n🔹 3. Prerequisite Graph & Dependency Validations:');

test('Detects absence of circular dependencies in valid catalog', () => {
    const validMockCourses = [
        { code: 'CS 230', prerequisites: [] },
        { code: 'CS 240', prerequisites: ['CS 230'] },
        { code: 'CS 350', prerequisites: ['CS 240'] }
    ];
    const cycles = PrerequisiteGraph.detectCircularDependencies(validMockCourses);
    assert.strictEqual(cycles.length, 0);
});

test('Detects circular dependencies if mistakenly introduced', () => {
    const cyclicMockCourses = [
        { code: 'A', prerequisites: ['B'] },
        { code: 'B', prerequisites: ['C'] },
        { code: 'C', prerequisites: ['A'] }
    ];
    const cycles = PrerequisiteGraph.detectCircularDependencies(cyclicMockCourses);
    assert.strictEqual(cycles.length > 0, true);
});

test('Evaluates student prerequisite status (completed, enrolled, available, blocked)', () => {
    const course = { code: 'CS 350', prerequisites: ['CS 240'] };
    assert.strictEqual(PrerequisiteGraph.evaluateCourseStatus(course, ['CS 240'], []), 'available');
    assert.strictEqual(PrerequisiteGraph.evaluateCourseStatus(course, [], []), 'blocked');
    assert.strictEqual(PrerequisiteGraph.evaluateCourseStatus(course, ['CS 350'], []), 'completed');
    assert.strictEqual(PrerequisiteGraph.evaluateCourseStatus(course, [], ['CS 350']), 'enrolled');
});

// ----------------------------------------------------
// 4. Smart Study Scheduler Tests
// ----------------------------------------------------
console.log('\n🔹 4. Smart Study Scheduling Engine:');

test('Generates study plan weighted by course difficulty and credits', () => {
    const enrolledCourses = [
        { code: 'CS 240', nameAr: 'هياكل البيانات', creditHours: 3, difficulty: 3.8 },
        { code: 'LAW 101', nameAr: 'مدخل للقانون', creditHours: 3, difficulty: 2.8 }
    ];
    const events = [
        { type: 'final_exams', startDate: '2026-12-10' }
    ];

    const tasks = SmartScheduleGenerator.generatePlan({
        enrolledCourses,
        calendarEvents: events,
        dailyHoursCapacity: 3.5,
        existingTasks: [],
        startDate: new Date('2026-11-20')
    });

    assert.strictEqual(tasks.length > 0, true);
    assert.strictEqual(tasks.some(t => t.courseCode === 'CS 240'), true);
    assert.strictEqual(tasks.some(t => t.courseCode === 'LAW 101'), true);
    // Harder course (CS 240) gets study sessions scheduled
    const csTasks = tasks.filter(t => t.courseCode === 'CS 240');
    assert.strictEqual(csTasks.length >= 3, true);
});

test('Preserves completed tasks when regenerating schedule', () => {
    const enrolledCourses = [
        { code: 'CS 240', nameAr: 'هياكل البيانات', creditHours: 3, difficulty: 3.8 }
    ];
    const existing = [
        { id: '1', courseCode: 'CS 240', date: '2026-11-20', topic: 'جلسة استذكار 1: مراجعة المفاهيم والتمارين', completed: true }
    ];

    const tasks = SmartScheduleGenerator.generatePlan({
        enrolledCourses,
        calendarEvents: [{ type: 'final_exams', startDate: '2026-12-10' }],
        existingTasks: existing,
        startDate: new Date('2026-11-20')
    });

    const task1 = tasks.find(t => t.topic.includes('جلسة استذكار 1'));
    assert.strictEqual(task1?.completed, true);
});

// ----------------------------------------------------
// 5. Academic Calendar Integrity Tests
// ----------------------------------------------------
console.log('\n🔹 5. Academic Calendar JSON & Schema Validation:');

test('Verified calendar JSON exists and conforms to specification', () => {
    const calPath = path.join(__dirname, '..', 'data', 'academic-calendar.json');
    assert.strictEqual(fs.existsSync(calPath), true);

    const calData = JSON.parse(fs.readFileSync(calPath, 'utf8'));
    assert.strictEqual(typeof calData.academicYear, 'string');
    assert.strictEqual(typeof calData.calendarVersion, 'string');
    assert.strictEqual(Array.isArray(calData.events), true);
    assert.strictEqual(calData.events.length >= 8, true);

    calData.events.forEach(evt => {
        assert.ok(evt.id, 'Event must have ID');
        assert.ok(evt.type, 'Event must have type');
        assert.ok(evt.nameAr, 'Event must have nameAr');
        assert.ok(evt.startDate, 'Event must have startDate');
        assert.ok(evt.endDate, 'Event must have endDate');
        assert.ok(!isNaN(Date.parse(evt.startDate)), 'Valid ISO start date');
    });
});

// ----------------------------------------------------
// 6. College of Theoretical Studies (College #4) Verification
// ----------------------------------------------------
console.log('\n🔹 6. College of Theoretical Studies & Manifest Directory:');

test('Theoretical Studies page and manifest contains required 4 majors', () => {
    const manifestPath = path.join(__dirname, '..', 'page', 'all-colleges', 'colleges-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const theoretical = manifest.colleges.find(c => c.college === 'theoretical');

    assert.ok(theoretical, 'College #4 (theoretical) must exist in manifest');
    assert.strictEqual(theoretical.displayName, 'كلية الدراسات النظرية');

    const majorsInTheoretical = new Set(theoretical.majors.map(m => m.id));
    assert.strictEqual(majorsInTheoretical.has('law'), true, 'Must include Law');
    assert.strictEqual(majorsInTheoretical.has('med'), true, 'Must include Digital Media');
    assert.strictEqual(majorsInTheoretical.has('trn'), true, 'Must include Languages and Translation');
    assert.strictEqual(majorsInTheoretical.has('stat'), true, 'Must include Applied Statistics and Data Analytics');
    assert.strictEqual(theoretical.courses.length, 0, 'No fake courses: courses list is empty until added by real students');
});

test('Approved majors for Health (2 majors) and Business (4 majors) total 13 across platform', () => {
    const studyPlansPath = path.join(__dirname, '..', 'data', 'study-plans.json');
    const sp = JSON.parse(fs.readFileSync(studyPlansPath, 'utf8'));

    const healthKeys = Object.keys(sp.colleges.health.majors);
    assert.deepStrictEqual(healthKeys, ['ph', 'hci'], 'Health college must have exactly 2 approved majors: ph and hci');

    const businessKeys = Object.keys(sp.colleges.business.majors);
    assert.deepStrictEqual(businessKeys, ['fin', 'acct', 'ba', 'ecom'], 'Business college must have exactly 4 approved majors: fin, acct, ba, ecom');

    const totalMajors = Object.values(sp.colleges).reduce((acc, col) => acc + Object.keys(col.majors).length, 0);
    assert.strictEqual(totalMajors, 13, 'Total approved majors across the 4 colleges must be 13 (3 + 4 + 2 + 4)');
});

test('Preparatory Year courses act as unified Level 3 gate with zero direct prerequisite arrows', () => {
    const studyPlansPath = path.join(__dirname, '..', 'data', 'study-plans.json');
    const sp = JSON.parse(fs.readFileSync(studyPlansPath, 'utf8'));
    const prepSet = new Set(['ENG001', 'ENG002', 'CS001', 'CI001', 'MATH001', 'COMM001']);

    for (const col of Object.values(sp.colleges)) {
        for (const maj of Object.values(col.majors)) {
            assert.ok(maj.prepYearGate, 'Major must define prepYearGate metadata');
            for (const arr of Object.values(maj.levels)) {
                for (const course of arr) {
                    const hasPrepArrow = (course.prerequisites || []).some(p => prepSet.has(p.replace(/\s+/g, '').toUpperCase()));
                    assert.strictEqual(hasPrepArrow, false, `Course ${course.code} should not have individual prep-year prerequisite arrow`);
                }
            }
        }
    }
});

// ----------------------------------------------------
// 7. Study Hub Precision Markdown Parser & UI Verification
// ----------------------------------------------------
console.log('\n🔹 7. Study Hub Precision Markdown Parser & UI Verification:');

test('Strict Module boundary detection splits ONLY on /^Module\\s+\\d+/i and excludes syllabus metadata sections & citations', () => {
    const sampleUniversityMd = `
College of Computing and Informatics
Bachelor of Data Science
DS470: Data Security and Privacy
Restricted -مقيد
الجامعةالسعودية...
ر
االلكت
26/12/2021
Module 1
Overview of Security and Privacy
Weekly Learning Outcomes
• 1. Define data security and privacy
• 2. Identify key threats and controls
Topics to cover
• Confidentiality, Integrity, and Availability
• Privacy frameworks
Required Reading
• 1. William Stallings and Lawrie Brown, "Computer Security:
"Principles and Practice", 4th Edition, Pearson (2018)
• 2. Dieter Gollmann, "Computer Security", 3rd
Edition, Wiley (2011)
Recommended Reading
• NIST Special Publication 800-12
Computer Security - Definition
• Protection afforded to an automated information system
• Preserves integrity, availability, and confidentiality
Main Objectives – Confidentiality, Integrity and Availability
• Confidentiality: Preserving authorized restrictions on access
• Integrity: Guarding against improper information modification
Levels of Security Breach Impact
1. Numbered list item one that must NOT become a top-level card
2. Numbered list item two that must NOT become a top-level card
\`\`\`Stray single-line fence wrapped around normal sentence\`\`\`
Module 8
Operating Systems Security and Security Auditing
(Part I)
Weekly Learning Outcomes
• 1. Understand OS hardening
• 2. Configure security auditing
Required Reading
• Chapter 8: Operating Systems Security
Operating System Hardening
• Remove unnecessary services, applications, and protocols
• Configure resource controls and patch management
Thank You
`;

    const parsed = parseMarkdownCourse(sampleUniversityMd);
    assert.strictEqual(parsed.modules.length, 2, 'Must produce exactly 2 top-level modules, never splitting bullets or numbered lists');
    assert.strictEqual(parsed.modules[0].title, 'Module 1: Overview of Security and Privacy');
    assert.strictEqual(parsed.modules[1].title, 'Module 8 (Part I): Operating Systems Security and Security Auditing');

    // Verify syllabus metadata sections and citation fragments are excluded from lessons
    const mod1LessonTitles = parsed.modules[0].lessons.map(l => l.title);
    assert.strictEqual(mod1LessonTitles.includes('Weekly Learning Outcomes'), false, 'Weekly Learning Outcomes must be excluded');
    assert.strictEqual(mod1LessonTitles.includes('Topics to cover'), false, 'Topics to cover must be excluded');
    assert.strictEqual(mod1LessonTitles.includes('Required Reading'), false, 'Required Reading must be excluded');
    assert.strictEqual(mod1LessonTitles.includes('Recommended Reading'), false, 'Recommended Reading must be excluded');
    assert.strictEqual(mod1LessonTitles.some(t => /Edition|Wiley|Principles and Practice/i.test(t)), false, 'Book citation continuations must never become lessons');

    // Verify actual lecture sections ARE created as trackable Lesson Cards
    assert.deepStrictEqual(mod1LessonTitles, [
        'Computer Security - Definition',
        'Main Objectives – Confidentiality, Integrity and Availability',
        'Levels of Security Breach Impact'
    ]);
    assert.deepStrictEqual(parsed.modules[1].lessons.map(l => l.title), [
        'Operating System Hardening'
    ]);

    // Verify noise was stripped and single-line fence was unwrapped
    const cleaned = cleanSource(sampleUniversityMd);
    assert.strictEqual(cleaned.includes('Restricted -مقيد'), false);
    assert.strictEqual(cleaned.includes('الجامعةالسعودية'), false);
    assert.strictEqual(cleaned.includes('26/12/2021'), false);
    assert.strictEqual(cleaned.includes('College of Computing and Informatics'), false);
    assert.strictEqual(cleaned.includes('Thank You'), false);
    assert.strictEqual(cleaned.includes('```Stray single-line fence'), false);
    assert.strictEqual(cleaned.includes('Stray single-line fence wrapped around normal sentence'), true);

    // Verify bullets are converted to clean markdown list items
    const normalized = normalizeBullets('• First point\n• 1. Outcome one');
    assert.strictEqual(normalized.includes('- First point'), true);
    assert.strictEqual(normalized.includes('- 1\\. Outcome one'), true);

    // Verify 4-option MCQ generation & English language detection (Zero Arabic mixed into English stems)
    assert.strictEqual(parsed.modules[0].lang, 'en');
    const enMcqs = parsed.modules[0].quizCandidates;
    assert.strictEqual(enMcqs.length > 0, true, 'Must generate MCQ questions for Module 1');
    enMcqs.forEach(q => {
        assert.strictEqual(q.type, 'mcq');
        assert.strictEqual(q.lang, 'en');
        assert.strictEqual(/[\u0600-\u06FF]/.test(q.question), false, `English MCQ question must not contain Arabic text: ${q.question}`);
        assert.strictEqual(Array.isArray(q.options), true);
        assert.strictEqual(q.options.length, 4, 'Each MCQ must have exactly 4 options (A, B, C, D)');
        assert.strictEqual(q.options.includes(q.answer), true, 'Options must include the correct answer');
        assert.strictEqual(new Set(q.options.map(o => o.toLowerCase())).size, 4, 'All 4 options must be distinct');
    });

    // Verify Arabic module language detection and Arabic 4-option MCQ generation
    const arabicSampleMd = `
Module 1
مدخل إلى القانون الدستوري
تعريف القاعدة القانونية
• القاعدة القانونية: هي قاعدة سلوكية عامة ومجردة تنظم العلاقات داخل المجتمع وتقترن بجزاء مادي
• الدستور: هو التشريع الأعلى الذي يحدد شكل الدولة ونظام الحكم وحقوق الأفراد
• القانون الإداري: مجموعة القواعد التي تنظم نشاط السلطة التنفيذية وأعمال الإدارة العامة
• العرف الدستوري: إلف درجت عليه السلطات الحاكمة في شأن من الشؤون الدستورية دون نص مكتوب
خصائص القاعدة القانونية
• قاعدة عامة ومجردة تخاطب الأشخاص بصفاتهم لا بذواتهم
• قاعدة اجتماعية تهدف إلى استقرار النظام العام في المجتمع
• قاعدة ملزمة تقترن بجزاء توقعه السلطة العامة على المخالف
`;
    const parsedArabic = parseMarkdownCourse(arabicSampleMd);
    assert.strictEqual(parsedArabic.modules[0].lang, 'ar');
    const arMcqs = parsedArabic.modules[0].quizCandidates;
    assert.strictEqual(arMcqs.length > 0, true, 'Must generate Arabic MCQ questions');
    arMcqs.forEach(q => {
        assert.strictEqual(q.type, 'mcq');
        assert.strictEqual(q.lang, 'ar');
        assert.strictEqual(/[\u0600-\u06FF]/.test(q.question), true, 'Arabic MCQ stem must be in Arabic');
        assert.strictEqual(q.options.length, 4, 'Arabic MCQ must have 4 options');
        assert.strictEqual(q.options.includes(q.answer), true);
    });
});

// ----------------------------------------------------
// 8. SEU-Planner Adapted Degree Matrix & Exam Schedule Tracker Tests
// ----------------------------------------------------
console.log('\n🔹 8. SEU-Planner Degree Matrix, Credits & Exam Schedule Tracker:');

test('Calculates Completed, Registered, and Remaining credits and completion percentage accurately', () => {
    const studyPlansPath = path.join(__dirname, '..', 'data', 'study-plans.json');
    const sp = JSON.parse(fs.readFileSync(studyPlansPath, 'utf8'));
    const csPlan = sp.colleges.computing.majors.cs;

    const states = {
        ENG001: COURSE_STATUS.COMPLETED, // 4 cr
        CS001: COURSE_STATUS.COMPLETED,  // 3 cr
        CI001: COURSE_STATUS.COMPLETED,  // 2 cr
        CS230: COURSE_STATUS.REGISTERED, // 3 cr
        MATH150: COURSE_STATUS.REGISTERED // 3 cr
    };

    const summary = calculateDegreePlanCredits(csPlan, states);
    assert.strictEqual(summary.completedCredits, 9);
    assert.strictEqual(summary.registeredCredits, 6);
    assert.strictEqual(summary.completedCoursesCount, 3);
    assert.strictEqual(summary.registeredCoursesCount, 2);
    assert.strictEqual(summary.remainingCredits, summary.totalCredits - 9 - 6);
});

test('Validates course unlock status across Prep-Year Gate and direct prerequisites', () => {
    const prepCodes = ['ENG001', 'CS001', 'CI001', 'ENG002', 'MATH001', 'COMM001'];
    const cs240 = { code: 'CS240', prerequisites: ['CS230'] };

    // Blocked when prep year incomplete
    const partialCompleted = new Set(['ENG001', 'CS230']);
    const state1 = evaluateCourseUnlockState(cs240, 4, partialCompleted, prepCodes);
    assert.strictEqual(state1.isUnlocked, false);
    assert.strictEqual(state1.missingPrepCount > 0, true);

    // Blocked when prep year done but CS230 missing
    const prepOnlyCompleted = new Set(prepCodes);
    const state2 = evaluateCourseUnlockState(cs240, 4, prepOnlyCompleted, prepCodes);
    assert.strictEqual(state2.isUnlocked, false);
    assert.deepStrictEqual(state2.missingDirect, ['CS230']);

    // Unlocked when prep year and CS230 are completed
    const allNeeded = new Set([...prepCodes, 'CS230']);
    const state3 = evaluateCourseUnlockState(cs240, 4, allNeeded, prepCodes);
    assert.strictEqual(state3.isUnlocked, true);
});

test('Sorts upcoming Midterm & Final exams chronologically and computes live countdown badges', () => {
    const now = new Date('2026-11-16T09:00:00');
    const schedules = {
        DS470: {
            midtermDate: '2026-11-20',
            midtermTime: '11:00',
            midtermPeriod: 'الفترة الأولى',
            finalDate: '2026-12-18',
            finalTime: '13:00',
            finalPeriod: 'الفترة الثانية'
        },
        CS240: {
            midtermDate: '2026-11-18',
            midtermTime: '09:00',
            midtermPeriod: 'الفترة الأولى'
        }
    };
    const lookup = {
        DS470: { code: 'DS470', nameAr: 'أمن وخصوصية البيانات' },
        CS240: { code: 'CS240', nameAr: 'هياكل البيانات' }
    };

    const timeline = buildUpcomingExamsTimeline(schedules, lookup, now);
    assert.strictEqual(timeline.length, 3);
    assert.strictEqual(timeline[0].courseCode, 'CS240', 'Nearest exam (Nov 18) must be first');
    assert.strictEqual(timeline[0].examType, 'midterm');
    assert.strictEqual(timeline[0].urgency, 'urgent');
    assert.strictEqual(timeline[1].courseCode, 'DS470', 'Second exam (Nov 20) must be second');
    assert.strictEqual(timeline[2].examType, 'final', 'Furthest exam (Dec 18) must be last');
});

test('Generates SEU-Planner module study schedule with reading, practice, review, sequential times, and 3-day final reviews', () => {
    const plan = generateSeuStudySchedule({
        courses: [{ code: 'DS470', nameAr: 'أمن وخصوصية البيانات' }],
        intensity: 'medium',
        startTime: '16:00',
        modulesPerCourse: 6,
        defaultEndDate: '2026-12-20',
        examSchedules: {
            DS470: { finalDate: '2026-12-18' }
        },
        startDate: new Date('2026-11-16T00:00:00')
    });

    assert.strictEqual(plan.sessions.length > 0, true);
    assert.strictEqual(plan.sessions.some(s => s.session_type === 'reading' && s.module_number === 1), true);
    assert.strictEqual(plan.sessions.some(s => s.session_type === 'practice' && s.module_number === 1), true);
    assert.strictEqual(plan.sessions.some(s => s.session_type === 'review' && s.module_number === 3), true);
    assert.strictEqual(plan.sessions.some(s => s.is_final_review === true), true, 'Must include 3-day pre-exam final review sessions');

    // Verify no two sessions on the same date have overlapping start times
    const byDate = {};
    plan.sessions.forEach(s => { (byDate[s.scheduled_date] ||= []).push(s); });
    Object.values(byDate).forEach(dayList => {
        const times = dayList.map(s => s.scheduled_time);
        assert.strictEqual(new Set(times).size, times.length, 'Sessions on the same day must have distinct sequential times');
    });
});

console.log('\n====================================================');
console.log(`📊 Test Summary: ${passedTests}/${totalTests} Tests Passed successfully.`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
    process.exit(1);
}
