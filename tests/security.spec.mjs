import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import {defaults} from '../src/core.mjs';

test('restored contact and document IDs cannot inject HTML or execute scripts',async({page})=>{
 const id='"><img src=x onerror="window.backupInjected=true"><button data-extra="';
 const state=defaults();state.contacts=[{id,name:'Security contact',phone:'+123456789',memo:'Test'}];
 const backup={format:'philmission-backup',version:1,state,documents:[{id,kind:'song',title:'Security document',type:'image/png',base64:fs.readFileSync('public/assets/icon-192.png').toString('base64'),youtube:'',createdAt:Date.now()}]};
 await page.goto('/#settings');
 await page.getByRole('button',{name:'백업 복원'}).click();
 await page.locator('input[name=file]').setInputFiles({name:'security-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.getByRole('button',{name:'저장',exact:true}).click();
 await expect(page.locator('#modal')).not.toBeVisible();
 await page.goto('/#contacts');
 await expect(page.getByText('Security contact',{exact:true})).toBeVisible();
 await expect(page.locator('[data-action="copy-contact"]')).toHaveAttribute('data-id',id);
 await page.goto('/#docs');
 await expect(page.getByText('Security document',{exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'열기',exact:true})).toHaveAttribute('data-go','user/'+id);
 await page.goto('/#worship');
 await expect(page.getByRole('button',{name:'Security document 내 찬양 자료'})).toHaveAttribute('data-go','user/'+id);
 expect(await page.evaluate(()=>({executed:!!window.backupInjected,images:document.querySelectorAll('img[src="x"]').length}))).toEqual({executed:false,images:0});
});
