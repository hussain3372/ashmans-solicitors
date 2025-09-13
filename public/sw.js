// const statis_cache_name = "s_cache_app";
// const dinamic_cache_name = "d_cache_app";

// self.addEventListener("install", async () => {
//   const cache = await caches.open(statis_cache_name);
//   await cache.addAll(["/index.html"]);
// });

// self.addEventListener("activate", async () => {
//   const cacheNames = await caches.keys();
//   await Promise.all(
//     cacheNames
//       .filter((name) => name !== statis_cache_name)
//       .filter((name) => name !== dinamic_cache_name)
//       .map((name) => caches.delete(name))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   const { request } = event;
//   const url = new URL(request.url);

//   if (url.origin === location.origin) {
//     event.respondWith(cacheFirst(event.request));
//   } else {
//     event.respondWith(networkFirst(event.request));
//   }
// });

// async function cacheFirst(request) {
//   const cached = await caches.match(request);
//   return cached ?? (await fetch(request));
// }

// async function networkFirst(request) {
//   const cache = await caches.open(dinamic_cache_name);
//   try {
//     const response = await fetch(request);
//     await cache.put(request, response.clone());
//     return response;
//   } catch (e) {
//     const cached = await cache.match(request);
//     return cached ?? (await caches.match("/offline.html"));
//   }
// }
