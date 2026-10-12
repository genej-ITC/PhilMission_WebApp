const CACHE='philmission-__BUILD_VERSION__';
const base=new URL('./',self.location.href);
// Cache the canonical start page. Some hosts redirect /index.html to /.
const files=['','styles.css','app.mjs','core.mjs','storage.mjs','content.json','manifest.webmanifest','assets/church-logo.png','assets/icon-192.png','assets/icon-512.png','vendor/pdf.mjs','vendor/pdf.worker.mjs',...__EXTRA_FILES__];
async function navigationResponse(response){
 // A navigation request with redirect mode manual cannot reuse a redirected
 // response from Cache Storage: Chromium rejects it with net::ERR_FAILED.
 if(!response.redirected)return response;
 return new Response(await response.arrayBuffer(),{status:response.status,statusText:response.statusText,headers:response.headers});
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await cache.addAll(files.map(f=>new URL(f,base).href));
 const page=await cache.match(base.href);
 if(page?.redirected)await cache.put(base.href,await navigationResponse(page));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('philmission-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();if(event.data?.type==='CHECK_OFFLINE')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const keys=await cache.keys();const ready=(await Promise.all(files.map(f=>cache.match(new URL(f,base).href)))).every(Boolean);event.ports[0]?.postMessage({ready,count:keys.length,version:CACHE});})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname)||url.pathname.includes('/api/'))return;event.respondWith((async()=>{
 const cache=await caches.open(CACHE);
 if(event.request.mode==='navigate'){
  const page=await cache.match(base.href);
  return page?navigationResponse(page):fetch(event.request);
 }
 const found=await cache.match(event.request);if(found)return found;
 const response=await fetch(event.request);
 if(response.ok&&!response.redirected&&!response.headers.get('content-type')?.includes('text/html'))await cache.put(event.request,response.clone());
 return response;
})());});
