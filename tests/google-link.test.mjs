import {test} from 'node:test';
import assert from 'node:assert/strict';
import {googleTranslationURL} from '../src/core.mjs';

test('Google translation uses a normal link and safely preserves input text',()=>{
 for(const to of ['tl','en']){
  const text='안녕하세요 & #Intent;package=other;end';
  const link=googleTranslationURL('ko',to,text);
  const web=new URL(link);
  assert.equal(web.protocol,'https:');assert.equal(web.origin,'https://translate.google.com');
  assert.equal(web.hash,'');
  assert.equal(web.searchParams.get('sl'),'ko');assert.equal(web.searchParams.get('tl'),to);
  assert.equal(web.searchParams.get('text'),text);
 }
});

test('Google HTTPS links preserve the requested language pair',()=>{
 for(const [from,to] of [['ko','tl'],['tl','ko'],['ko','en']]){
  const url=new URL(googleTranslationURL(from,to));
  assert.equal(url.origin,'https://translate.google.com');
  assert.equal(url.searchParams.get('sl'),from);assert.equal(url.searchParams.get('tl'),to);
  assert.equal(url.searchParams.get('text'),'');assert.equal(url.searchParams.get('hl'),'ko');
 }
});
