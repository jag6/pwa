const swVersion = 'v1';
const cacheName = `period-tracker-${swVersion}`;

const appStaticResources = [
    '/',
    '/index.html',
    '/css/style.css',
    '/app.js',
    '/manifest/manifest.json',
    '/manifest/icons/circle.ico',
    '/manifest/icons/circle.svg',
    '/manifest/icons/favicon.ico',
    '/manifest/icons/tire.svg',
    '/manifest/icons/wheel.svg',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            cache.addAll(appStaticResources);
        })()
    );
});

// delete old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if(name !== cacheName) {
                        return caches.delete(name);
                    }
                })
            );
            await clients.claim();
        })()
    );
});

// intercept server requests and respond with cached responses instead of going to network
self.addEventListener('fetch', (e) => {
    // direct app to always go to homepage
    if(e.request.mode === 'navigate') {
        e.respondWith(caches.match('/'));
        return;
    }

    // for all other requests, go to the cache first, then the network
    e.respondWith(
        (async () => {
            const cache = await caches.open(cacheName);
            const cachedResponse = await cache.match(e.request.url);
            if(cachedResponse) {
                return cachedResponse;
            }
            return new Response(null, {status: 404});
        })(),
    );
});