const CACHE_NAME = 'molscreen-v67';

// List of assets to cache for offline use
const ASSETS = [
'./index.html',
'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

// 1. Installation: Download all assets into the cache
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
      // Use cache.addAll — it handles the fetching and storing correctly
      // It will only cache if the response is 'OK' (status 200)
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
@@ -24,15 +29,20 @@ self.addEventListener('activate', (event) => {
);
})
);
  // Important: Take control of the page immediately
  // Take control of all open tabs immediately
return self.clients.claim();
});

// 3. Fetch: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
event.respondWith(
caches.match(event.request).then((cachedResponse) => {
      // Return from cache, otherwise fetch from network
      // If the file is in the cache, return it (works offline)
      // If not, try to fetch it from the network
return cachedResponse || fetch(event.request);
    }).catch(() => {
        // Optional: fallback if both cache and network fail
        console.error('Resource not found in cache or network');
})
);
});
