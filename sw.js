const CACHE_NAME = 'easyfit-v0';
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
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request)
        .then(function (response) {
            if (response) {
                return response;
            }

            return fetch(e.request).then(
                function (response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(e.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});