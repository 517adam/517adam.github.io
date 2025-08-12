const CACHE_NAME = 'site-cache-v3';
const OFFLINE_FALLBACK = '/index.html';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/scripts.js',
  '/manifest.webmanifest',
  '/blog/',
  '/blog/index.html',
  '/blog/posts.json',
  '/blog/game/index.html'
];

// Normalize helper (e.g. collapse /blog/blog/)
function normalizePath(p){
  return p.replace(/\\+/g,'/').replace(/\/blog\/blog\//g,'/blog/');
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async c => {
      await c.addAll(CORE_ASSETS);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k!==CACHE_NAME).map(k => caches.delete(k)));
    // Claim so updated SW controls pages immediately
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return; // ignore cross origin

  // Normalize duplicate blog path in navigation requests
  let request = e.request;
  if(request.mode === 'navigate') {
    const normalized = normalizePath(url.pathname) + url.search + url.hash;
    if(normalized !== url.pathname + url.search + url.hash){
      e.respondWith(Response.redirect(normalized, 301));
      return;
    }
  }

  // Strip version query for posts.json so cache updates correctly
  let cacheKeyRequest = request;
  if(url.pathname.endsWith('/blog/posts.json')){
    cacheKeyRequest = new Request('/blog/posts.json');
  }

  e.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Network-first for JSON & HTML, cache-first for others (basic split)
    const isDataOrPage = /\.json$|\.html$/.test(url.pathname) || request.mode === 'navigate';
    if(isDataOrPage){
      try{
        const netResp = await fetch(request);
        if(netResp && netResp.ok) cache.put(cacheKeyRequest, netResp.clone());
        return netResp;
      }catch(err){
        const cached = await cache.match(cacheKeyRequest);
        if(cached) return cached;
        if(request.mode === 'navigate') return cache.match(OFFLINE_FALLBACK);
        throw err;
      }
    } else {
      const cached = await cache.match(request);
      if(cached) return cached;
      try {
        const netResp = await fetch(request);
        if(netResp && netResp.ok) cache.put(request, netResp.clone());
        return netResp;
      } catch(err){
        return cache.match(OFFLINE_FALLBACK);
      }
    }
  })());
});
