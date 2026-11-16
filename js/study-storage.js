const DB_NAME = 'pmaru-study-hub';
const DB_VERSION = 1;
const SESSION_STORE = 'sessions';
const META_STORE = 'meta';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(SESSION_STORE)) {
                database.createObjectStore(SESSION_STORE, { keyPath: 'code' });
            }
            if (!database.objectStoreNames.contains(META_STORE)) {
                database.createObjectStore(META_STORE, { keyPath: 'key' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('تعذر فتح قاعدة البيانات المحلية'));
    });
}

function transaction(storeName, mode, action) {
    return openDatabase().then(database => new Promise((resolve, reject) => {
        const request = action(database.transaction(storeName, mode).objectStore(storeName));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('تعذر حفظ البيانات محلياً'));
    }));
}

export function makeSessionCode({ collegeId = 'PMARU', courseCode = 'STUDY' } = {}) {
    const prefix = String(courseCode || collegeId).replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8) || 'STUDY';
    const random = crypto.getRandomValues(new Uint8Array(2))
        .reduce((value, byte) => `${value}${byte.toString(16).padStart(2, '0')}`, '')
        .toUpperCase();
    return `PMARU-${prefix}-${random}`;
}

export function createSession(metadata = {}) {
    return {
        code: makeSessionCode(metadata),
        metadata: {
            collegeId: metadata.collegeId || 'computing',
            collegeName: metadata.collegeName || '',
            majorId: metadata.majorId || '',
            majorName: metadata.majorName || '',
            courseCode: metadata.courseCode || '',
            courseName: metadata.courseName || ''
        },
        markdown: '',
        fileName: '',
        modules: [],
        topics: [],
        topicStates: {},
        lessonStates: {},
        quizzes: {},
        selectedModuleId: '',
        selectedLessonId: '',
        goals: [],
        mistakes: [],
        selectedTopicId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

export function saveSession(session) {
    const record = {
        ...session,
        updatedAt: new Date().toISOString()
    };
    return transaction(SESSION_STORE, 'readwrite', store => store.put(record)).then(() => record);
}

export function getSession(code) {
    return transaction(SESSION_STORE, 'readonly', store => store.get(String(code || '').trim().toUpperCase()));
}

export function getActiveSessionCode() {
    return transaction(META_STORE, 'readonly', store => store.get('activeSession'))
        .then(record => record ? record.value : '');
}

export function setActiveSessionCode(code) {
    return transaction(META_STORE, 'readwrite', store => store.put({ key: 'activeSession', value: code }));
}

export function validateSession(value) {
    if (!value || typeof value !== 'object' || typeof value.code !== 'string') {
        throw new Error('ملف الجلسة غير صالح أو لا يحتوي على رمز جلسة');
    }
    return {
        ...createSession(value.metadata || {}),
        ...value,
        metadata: { ...createSession().metadata, ...(value.metadata || {}) },
        fileName: typeof value.fileName === 'string' ? value.fileName : '',
        topics: Array.isArray(value.topics) ? value.topics : [],
        modules: Array.isArray(value.modules) ? value.modules : [],
        topicStates: value.topicStates && typeof value.topicStates === 'object' ? value.topicStates : {},
        lessonStates: value.lessonStates && typeof value.lessonStates === 'object' ? value.lessonStates : {},
        quizzes: value.quizzes && typeof value.quizzes === 'object' ? value.quizzes : {},
        goals: Array.isArray(value.goals) ? value.goals : [],
        mistakes: Array.isArray(value.mistakes) ? value.mistakes : []
    };
}

export function exportSessionJson(session) {
    const payload = JSON.stringify(validateSession(session), null, 2);
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.code}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readSessionFile(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.name.toLowerCase().endsWith('.json')) {
            reject(new Error('اختر ملف جلسة بصيغة JSON'));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                resolve(validateSession(JSON.parse(reader.result)));
            } catch (error) {
                reject(error instanceof Error ? error : new Error('تعذر قراءة ملف الجلسة'));
            }
        };
        reader.onerror = () => reject(new Error('تعذر قراءة ملف الجلسة'));
        reader.readAsText(file);
    });
}
