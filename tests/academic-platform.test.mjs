/**
 * Subject Search 2.0 - Automated Test Suite
 * Validates search, fuzzy matching, calendar countdowns, prerequisites, scheduling, and duplicate review prevention.
 */

import assert from 'assert';
import { FuzzySearch } from '../assets/js/search/fuzzy-search.js';
import { normalizeArabic, getSynonymsForQuery } from '../assets/js/search/synonyms.js';
import { SmartScheduleGenerator } from '../assets/js/planner/schedule-generator.js';
import { PrerequisiteGraph } from '../assets/js/courses/prerequisite-graph.js';
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

console.log('\n====================================================');
console.log(`📊 Test Summary: ${passedTests}/${totalTests} Tests Passed successfully.`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
    process.exit(1);
}
