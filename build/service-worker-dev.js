// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432

// self.addEventListener('install', () => self.skipWaiting());
// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim())
//   console.log('active')
//   self.clients.matchAll({ type: 'window' }).then(windowClients => {
//     console.log(windowClients);
//     for (let windowClient of windowClients) {
//       console.log('active')
//       // Force open pages to refresh, so that they have a chance to load the
//       // fresh navigation response from the local dev server.
//       windowClient.navigate(windowClient.url);
//     }
//   });
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.filter(cacheNames => {
//           return cacheNames !== CacheStorageKey
//         }).map(cacheNames => {
//           return caches.delete(cacheNames)
//         })
//       )
//     }).then(() => {
//       return self.clients.claim()
//     })
//   )
// })
