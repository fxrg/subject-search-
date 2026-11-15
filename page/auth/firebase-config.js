// ============================================================================
// Firebase Configuration — جامعة الأمير مساعد بن عبدالرحمن (Subject Search 2.0)
// Connected to Real Firebase Authentication & Firestore (seu-subjects)
// ============================================================================
const firebaseConfig = {
    apiKey: "AIzaSyCen8J6HuLOj3d1tpEA8aF13XVmGxiG9BY",
    authDomain: "seu-subjects.firebaseapp.com",
    projectId: "seu-subjects",
    storageBucket: "seu-subjects.firebasestorage.app",
    messagingSenderId: "552315681734",
    appId: "1:552315681734:web:d7ae70e54e7e2bf7b290c7",
    measurementId: "G-Y2FL6V8X3L"
};

if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps || firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        window.auth = firebase.auth();
        if (firebase.firestore) {
            window.db = firebase.firestore();
        }
        console.log('Firebase Authentication & Firestore connected successfully.');
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}
