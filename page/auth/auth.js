// ============================================================================
// Pure Firebase Authentication Bridge (Local Storage Auth Permanently Removed)
// ============================================================================
(function () {
    'use strict';

    try {
        localStorage.removeItem('courseApp_users');
        localStorage.removeItem('courseApp_currentUser');
    } catch (e) {}

    window.authSystem = {
        isLoggedIn() {
            return Boolean(window.currentPmaruUser || (window.auth && window.auth.currentUser));
        },
        getCurrentUser() {
            return window.currentPmaruUser || (window.auth ? window.auth.currentUser : null);
        },
        async logout() {
            if (window.auth) {
                await window.auth.signOut();
            }
            window.location.href = (window.getPmaruRootPrefix ? window.getPmaruRootPrefix() : '') + 'index.html';
        }
    };
})();
