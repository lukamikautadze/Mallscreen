const playlist = [
'https://www.dropbox.com/scl/fi/p3jnpcnq5zq0i00y423lj/.mp4?rlkey=c87u2tmn8amluocftqtn792cl&st=d1wh4tew&raw=1',
'https://www.dropbox.com/scl/fi/v2bx6rptchmopoyj2wg84/.mp4?rlkey=a8d5xdh97r1k0b5y1p06mmvkr&st=05anps8s&raw=1'
];

// ფუნქცია, რომელიც ვიდეოს აქცევს "ლოკალურ ფაილად"
async function getLocalVideoUrl(url) {
    const cache = await caches.open('molscreen-v2');
    let response = await cache.match(url);
    
    // თუ ქეშში არ არის, ინტერნეტიდან მოაქვს
    if (!response) {
        response = await fetch(url);
        cache.put(url, response.clone());
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

async function prepareNext(player, index) {
    try {
        const localUrl = await getLocalVideoUrl(playlist[index]);
        player.src = localUrl;
        player.load();
    } catch (e) {
        console.error("ოფლაინ ჩატვირთვის შეცდომა", e);
    }
}
