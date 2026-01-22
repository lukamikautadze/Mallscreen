const CACHE_NAME = 'molscreen-v1';
const urlsToCache = [
  './index.html',
  // აქ ჩაამატე შენი ვიდეოს ლინკები, რომ ბრაუზერმა დაიმახსოვროს
  'https://www.dropbox.com/scl/fi/fdey9od9eii498lsanwt6/Video-lyriced-by-kirkitaa7-music-lyricedits-k...-7594790642086087943.mp4?rlkey=5f5bv46xlacc7wrr0rgjqlnis&st=ooubh7e6&dl=0',
  'https://www.dropbox.com/scl/fi/15wx1gsxro91i7dnv42wz/KFC.mp4?rlkey=e6sn7glqwf2hl4bsqb1eve0f0&st=15baqphh&dl=0'
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
