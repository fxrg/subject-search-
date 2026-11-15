/**
 * Subject Search 2.0 - Progressive Web App Service Worker
 * Provides offline access, static asset caching, and background sync fallback.
 */

const CACHE_NAME = 'subject-search-v2.0';
const STATIC_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './course_data.json',
    './data/academic-calendar.json',
    './page/all-colleges/colleges-manifest.json',
    './page/all-colleges/all-colleges.html',
    './page/all-colleges/theoretical/theoretical.html',
    './assets/Favicon.png',
    './assets/website_logo.png',
    './assets/chatbot.css',
    './assets/js/core/config.js',
    './assets/js/core/app.js',
    './assets/js/cache/indexeddb.js',
    './assets/js/cache/cache-manager.js',
    './assets/js/services/course-service.js',
    './assets/js/services/calendar-service.js',
    './assets/js/search/synonyms.js',
    './assets/js/search/fuzzy-search.js',
    './assets/js/search/search-engine.js',
    './assets/js/planner/schedule-generator.js',
    './assets/js/planner/planner-engine.js',
    './assets/js/courses/prerequisite-graph.js',
    './assets/js/courses/course-comparison.js',
    './assets/js/courses/course-analytics.js',
    './assets/js/community/reviews.js',
    './assets/js/community/library.js',
    './assets/js/assistant/academic-assistant.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline shell');
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('[ServiceWorker] Some assets could not be cached during install:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing obsolete cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests and external analytics/ads
    if (event.request.method !== 'GET' || url.origin !== location.origin) {
        return;
    }

    // JSON Data requests: Stale-While-Revalidate
    if (url.pathname.endsWith('.json')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(event.request);
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Static assets / HTML: Cache First, fallback to network
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Return offline shell for navigations
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
