const CACHE_NAME = 'molscreen-v4.7'; // ვერსია შევცვალე, რომ ტელევიზორმა განაახლოს
const ASSETS = [
  './index.html',
  'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
  'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ვიდეოები იწერება...');
      // ვიყენებთ map-ს, რომ სათითაოდ სცადოს ფაილები. 
      // თუ ერთი გაფუჭდა, სხვები მაინც ჩაიწეროს.
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(new Request(url, { mode: 'no-cors' })).catch(err => 
            console.error('ვერ ჩაიწერა ფაილი:', url, err)
          );
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // ეს ნაწილი აუცილებელია Dropbox-ის სწორი "სტრიმინგისთვის"
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
})
