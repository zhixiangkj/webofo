var CACHE_NAME = "my_cache";
var offlineUrl = '/static/offline.html'
var urlsToCache = [
    '/',
    '/index.html',
    '/static/js/app.js',
    '/static/offline.html'
];      

//这里的self代表ServiceWorkerGlobalScope  
self.addEventListener('install', function(event) {
//这里的waitUtil会在安装成功之前执行一些预装的操作，但是只建议做一些轻量级和非常重要资源的缓存，减少安装失败的概率。安装成功  
//后ServiceWorker状态会从installing变为installed   
    event.waitUntil(  
        caches.open(CACHE_NAME).then(function(cache) {  
            // cache.add()  添加多个
            // cache
            return cache.addAll(urlsToCache);  
      })
    );
    return self.skipWaiting();  
});

self.addEventListener('fetch', function (event) {
    if (!self.navigator.onLine) {
        // console.log('[ServiceWorker] 没有网络，跳转离线页');
        event.respondWith(
            caches.match(event.request).then(function (response) {
                console.log(event,response)
                // return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><title id="offline-title">Offline</title><path fill="rgba(145,145,145,0.5)" d="M0 0h400v225H0z" /><text fill="rgba(0,0,0,0.33)" font-family="Helvetica Neue,Arial,sans-serif" font-size="27" text-anchor="middle" x="200" y="113" dominant-baseline="central">offline</text></svg>', {headers: {'Content-Type': 'image/svg+xml'}});
                // return new Response('<html><div><img src="/static/img/riding/bike.png"></div></html>', {headers: {'Content-Type': 'text/html'}});
                return caches.match(offlineUrl);
            })
        );
    }

    // if (event.request.mode === 'no-cors' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    //     event.respondWith(
    //         fetch(event.request.url).catch(error => {
    //             // Return the offline page
    //             return caches.match(urlsToCache);
    //       })
    //    );
    // }
    // else{
        // event.respondWith(
        //     fetch(event.request)
        //     .then(function (response) {
                
        //         console.log(response)
        //     })
        //     .catch(function() {
        //         return caches.match(offline)
        //     })
        // )
        // event.respondWith(caches.match(event.request)
        //   .then(function (response) {
        //     return response || fetch(event.request);
        //   })
        // );
    // }
  });