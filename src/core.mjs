export const categories = {all:'전체', greeting:'인사·자기소개', children:'어린이 사역', meal:'배식·식사', visit:'심방·위로', emergency:'응급·병원'};
export const defaults = () => ({version:1, language:'tl', fontStep:1, keepAwake:true, favorites:[], contacts:[], overrides:{}});
export function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function googleTranslationURL(from,to,text='') {
 return 'https://translate.google.com/?'+new URLSearchParams({sl:from,tl:to,text,op:'translate',hl:'ko'});
}
export function matches(phrase, query='') { const q=query.trim().toLocaleLowerCase();return !q || [phrase.ko,phrase.tl,phrase.en].some(x=>x.toLocaleLowerCase().includes(q)); }
export function filterPhrases(phrases, query, category, favoritesOnly, favorites) { return phrases.filter(p=>matches(p,query) && (category==='all'||p.category===category) && (!favoritesOnly||favorites.includes(p.id))); }
export function normalizeYoutube(input) {
 const text=input.trim(); if(!text)return '';
 try {const u=new URL(/^[a-z]+:\/\//i.test(text)?text:'https://'+text); if(!['http:','https:'].includes(u.protocol))return null;return u.hostname==='youtu.be'||u.hostname==='youtube.com'||u.hostname.endsWith('.youtube.com')?u.href:null;}catch{return null;}
}
export function validateContact(c,required=true) { if(!c.name.trim())return '이름을 입력해 주세요.';if(!c.phone.trim())return required?'전화번호를 입력해 주세요.':null;return /^[\d+() -]+$/.test(c.phone)&&c.phone.replace(/\D/g,'').length>=3?null:'전화번호 형식을 확인해 주세요.'; }
export function classifyBlocks(blocks) {
 let run=0,left=0;return blocks.map(text=>{const latin=(text.match(/[a-z]/gi)||[]).length,hangul=(text.match(/[가-힣]/g)||[]).length;let kind;
 if(latin>hangul){run++;kind='tagalog';}else{if(run>0){left=run;run=0;}kind=left>0?'pronunciation':'korean';if(left>0)left--;}
 return {text,kind};});
}
export function localTranslation(content,text,from,to) {
 const q=text.trim().toLocaleLowerCase().replace(/[.!?。]+$/,'');
 const rows=[...content.phrases,...content.worship.flatMap(x=>x.sentences),...content.gospel.cards,content.gospel.prayer];
 const row=rows.find(x=>x[from]?.trim().toLocaleLowerCase().replace(/[.!?。]+$/,'')===q);
 return row?.[to]??null;
}
export function validateBackup(data) {
 if(data?.format!=='philmission-backup'||data.version!==1||!data.state||!Array.isArray(data.documents))throw Error('PhilMission 백업 파일이 아닙니다.');
 const s=data.state;if(!['tl','en'].includes(s.language)||![0,1,2].includes(s.fontStep)||typeof s.keepAwake!=='boolean'||!Array.isArray(s.favorites)||s.favorites.some(x=>typeof x!=='string')||!Array.isArray(s.contacts)||!s.overrides||typeof s.overrides!=='object'||Array.isArray(s.overrides))throw Error('백업 설정이 올바르지 않습니다.');
 for(const c of [...s.contacts,...Object.values(s.overrides)])if(typeof c.id!=='string'||typeof c.name!=='string'||typeof c.phone!=='string'||typeof c.memo!=='string')throw Error('연락처 백업이 올바르지 않습니다.');
 const ids=new Set();for(const d of data.documents){if(typeof d.id!=='string'||ids.has(d.id)||!['song','message','schedule','order'].includes(d.kind)||typeof d.title!=='string'||!['application/pdf','image/jpeg','image/png'].includes(d.type)||typeof d.base64!=='string'||!Number.isFinite(d.createdAt)||normalizeYoutube(d.youtube||'')===null)throw Error('자료 백업이 올바르지 않습니다.');ids.add(d.id);}
 return data;
}
