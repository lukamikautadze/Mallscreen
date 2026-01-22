const CACHE_NAME = 'molscreen-v4.6';
const ASSETS = [
  './index.html',
  // აქ ჩაამატე შენი Dropbox-ის პირდაპირი ლინკები (dl=1)
'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('ვიდეოები იწერება მეხსიერებაში...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
  }));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

