import {test} from 'node:test';
import assert from 'node:assert/strict';
import {googleTranslationURL} from '../src/core.mjs';

test('Android translation targets Chrome and preserves languages in the browser fallback',()=>{
 for(const to of ['tl','en']){
  const text='안녕하세요 & #Intent;package=other;end';
  const intent=googleTranslationURL('ko',to,text,true);
  assert.ok(intent.startsWith('intent://translate.google.com/'));
  const [destination,extras]=intent.split('#Intent;');
  assert.equal(extras.split(';').filter(x=>x.startsWith('package=')).join(''),'package=com.android.chrome');
  const web=new URL(destination.replace(/^intent:/,'https:'));
  assert.equal(web.searchParams.get('sl'),'ko');assert.equal(web.searchParams.get('tl'),to);
  assert.equal(web.searchParams.get('text'),text);
  const fallback=decodeURIComponent(extras.split(';').find(x=>x.startsWith('S.browser_fallback_url=')).slice('S.browser_fallback_url='.length));
  assert.equal(fallback,web.href);
 }
});

test('iPhone and desktop use a normal Google HTTPS link with the requested language pair',()=>{
 for(const [from,to] of [['ko','tl'],['tl','ko'],['ko','en']]){
  const url=new URL(googleTranslationURL(from,to));
  assert.equal(url.origin,'https://translate.google.com');
  assert.equal(url.searchParams.get('sl'),from);assert.equal(url.searchParams.get('tl'),to);
  assert.equal(url.searchParams.get('text'),'');assert.equal(url.searchParams.get('hl'),'ko');
 }
});
