const CACHE_NAME = 'molscreen-v6.0';

// List of assets to cache for offline use
const ASSETS = [
  './index.html',
  'გოჩიტ.mp4',
  'კფცცც.mp4'
];

// 1. Installation: Download all assets into the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets for offline use...');
      // addAll is cleaner and handles the fetch internally without no-cors
      return cache.addAll(ASSETS);
    })
  );
  // Force this version to activate immediately
  self.skipWaiting();
});

// 2. Activation: Clean up old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  // Take control of all open tabs immediately
  return self.clients.claim();
});

// 3. Fetch: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If the file is in the cache, return it (works offline)
      // If not, try to fetch it from the network
      return cachedResponse || fetch(event.request);
    }).catch(() => {
        // Optional: fallback if both cache and network fail
        console.error('Resource not found in cache or network');
    })
  );
});
