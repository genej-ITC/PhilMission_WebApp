import {test,expect} from '@playwright/test';
test('canonical start page survives redirects, cached redirected responses and relaunch',async({page,context},info)=>{
 const redirect=await context.request.get('/index.html',{maxRedirects:0});expect(redirect.status()).toBe(307);
 await page.goto('/');await expect(page.getByRole('heading',{name:'함께 드리는 예배'})).toBeVisible();
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller);
 const cached=await page.evaluate(async()=>{const key=(await caches.keys()).find(x=>x.startsWith('philmission-')),cache=await caches.open(key),root=await cache.match(location.origin+'/');return {redirected:root.redirected,hasIndex:!!(await cache.match(location.origin+'/index.html'))};});
 expect(cached).toEqual({redirected:false,hasIndex:false});
 await page.reload();await expect(page.getByRole('heading',{name:'함께 드리는 예배'})).toBeVisible();
 // Reproduce the old bad cache entry. The new worker must safely normalize it.
 await page.evaluate(async()=>{const redirected=await fetch('/index.html');if(!redirected.redirected)throw Error('Redirect fixture did not redirect');const cache=await caches.open((await caches.keys()).find(x=>x.startsWith('philmission-')));await cache.put(location.origin+'/',redirected);});
 await page.reload();await expect(page.getByRole('heading',{name:'함께 드리는 예배'})).toBeVisible();
 await page.close();const relaunched=await context.newPage();
 if(info.project.name==='android-chrome')await context.setOffline(true);
 await relaunched.goto('/');await expect(relaunched.getByRole('heading',{name:'함께 드리는 예배'})).toBeVisible();
});
