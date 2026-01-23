const CACHE_NAME = 'molscreen-static-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html'
];

// Cache core assets on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Intercept requests for offline access
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests like Dropbox videos in the Service Worker
    // to prevent Range Request issues on Smart TVs
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
