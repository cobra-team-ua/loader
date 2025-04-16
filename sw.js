const CACHE_NAME = 'cobra-downloader-v1';
const urlsToCache = [
    '/index.html',
    '/manifest.json',
    '/images/icon-192.png',
    '/images/icon-512.png',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                if (event.request.url.includes('tikwm.com')) {
                    return new Response(
                        JSON.stringify({ error: 'Интернет-соединение требуется для загрузки видео' }),
                        { status: 503, headers: { 'Content-Type': 'application/json' } }
                    );
                }
            });
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
