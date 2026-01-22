const CACHE_NAME = 'molscreen-v1';
const urlsToCache = [
  './index.html',
  // აქ ჩაამატე შენი ვიდეოს ლინკები, რომ ბრაუზერმა დაიმახსოვროს
  'https://drive.google.com/file/d/1HRWjM1OjrRD_XXZ44nHWxTsXYeGhGNkf/view?usp=sharing',
  'https://drive.google.com/file/d/1jyJ9Lr7dv77I7m3ogym5ZR4oZeT3WnsI/view?usp=sharing'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
