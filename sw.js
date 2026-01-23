const CACHE_NAME = 'molscreen-v10';
const ASSETS = [
  './index.html',
  'https://raw.githubusercontent.com/lukamikautadze/Mallscreen/main/video1.mp4',
  'https://raw.githubusercontent.com/lukamikautadze/Mallscreen/main/video2.mp4'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
