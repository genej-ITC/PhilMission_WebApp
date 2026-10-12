import {test,expect} from '@playwright/test';
import fs from 'node:fs';

test.use({serviceWorkers:'block'});

test('static app translates built-in phrases and opens Google only on a user click',async({page,context})=>{
 let apiCalls=0,popups=0;
 page.on('request',r=>{if(r.url().includes('/api/translate'))apiCalls++;});
 page.on('popup',()=>popups++);
 await context.route('https://translate.google.com/**',r=>r.fulfill({contentType:'text/html',body:'Translation test'}));
 await page.addInitScript(()=>{window.SpeechRecognition=class{start(){this.onresult({results:[Object.assign([{transcript:'A new sentence for voice testing'}],{isFinal:true})]});}abort(){}};});
 await page.goto('/#translate');
 await page.locator('#speech-text').fill('안녕하세요.');
 await page.getByRole('button',{name:'번역',exact:true}).click();
 await expect(page.locator('#translated')).toHaveText('Kumusta po?');
 await page.getByRole('button',{name:'한국어 말하기',exact:true}).click();
 await expect(page.locator('#speech-status')).toContainText('Google 번역에서 확인할 수 있습니다');
 expect(popups).toBe(0);
 await page.locator('#speech-text').fill('A new sentence with <special> & characters');
 const popupPromise=page.waitForEvent('popup');
 await page.getByRole('button',{name:'번역',exact:true}).click();
 const popup=await popupPromise;await popup.waitForLoadState();
 const url=new URL(popup.url());
 expect(url.origin).toBe('https://translate.google.com');
 expect(url.searchParams.get('text')).toBe('A new sentence with <special> & characters');
 expect(url.searchParams.get('sl')).toBe('ko');expect(url.searchParams.get('tl')).toBe('tl');
 await expect(page.locator('#translated')).toBeEmpty();
 await expect(page.locator('#speech-status')).toContainText('Google 번역에서 결과를 확인');
 expect(apiCalls).toBe(0);await popup.close();
});

test('configured server mode distinguishes unavailable endpoints and provider errors',async({page})=>{
 await page.route('http://127.0.0.1:4173/',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('dist/index.html','utf8').replace('name="translation-api-enabled" content="false"','name="translation-api-enabled" content="true"')}));
 let reply={status:200,contentType:'application/json',body:JSON.stringify({translation:'Server translation'})};
 await page.route('**/api/translate',r=>r.fulfill(reply));
 await page.goto('/#translate');await page.locator('#speech-text').fill('Not a built-in phrase');
 const button=page.getByRole('button',{name:'번역',exact:true});
 await button.click();await expect(page.locator('#translated')).toHaveText('Server translation');
 for(const status of [403,404,405,503]){
  reply={status,contentType:'text/html',body:'Unavailable'};await button.click();
  await expect(page.locator('#speech-status')).toContainText('자동 번역 서비스가 연결되어 있지 않습니다');
  await expect(page.locator('#translated')).toBeEmpty();
 }
 reply={status:200,contentType:'text/html',body:'Static fallback page'};await button.click();
 await expect(page.locator('#speech-status')).toContainText('자동 번역 서비스가 연결되어 있지 않습니다');
 reply={status:502,contentType:'application/json',body:'{}'};await button.click();
 await expect(page.locator('#speech-status')).toContainText('번역에 실패했습니다');
});
