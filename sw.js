const CACHE_NAME = 'easyfit-v0.7.0';

const urlsToCache = [
    '/',
    '/favicon.ico',
    '/app.css',
    '/fitbit.js',
    '/ui.js',
    '/app.js',
    '/img/easyfit.svg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(urlsToCache);
        })
        .then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
        .then((response) => {
            if (response) {
                return response;
            }

            return fetch(e.request).then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(e.request, responseToCache);
                    });

                return response;
            });
        })
    );
});