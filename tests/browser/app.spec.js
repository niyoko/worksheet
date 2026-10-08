import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {worksheets} from '../../src/data.js';
test('catalog has 20 drafts, filters and search work without mobile overflow',async({page})=>{
 await page.goto('/');await expect(page.locator('.worksheet-card')).toHaveCount(20);
 for(const name of ['Matematika','Bahasa Indonesia','Bahasa Inggris','PPKn']){await page.getByRole('button',{name:new RegExp('^'+name)}).click();await expect(page.locator('.worksheet-card')).toHaveCount(5);}
 await page.getByRole('button',{name:/^Semua/}).click();await page.getByRole('searchbox').fill('Detektif');await expect(page.locator('.worksheet-card')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('answer, check, edit, reload, complete, catalog status and reset',async({page})=>{
 await page.goto('/#worksheet/math-1');await page.getByLabel('Jawabanmu').first().fill('3');await page.reload();await expect(page.getByLabel('Jawabanmu').first()).toHaveValue('3');
 await page.getByRole('button',{name:'Periksa jawaban'}).click();await expect(page.locator('#result')).toContainText('1 dari 5');
 const w=worksheets[0];for(const [i,q] of w.questions.entries()){const group=page.locator(`#q-${i}`);if(q.options)await group.getByRole('radio',{name:new RegExp(q.answers[0]+'$')}).check();else await group.getByRole('textbox').fill(q.answers[0]);}
 await page.getByRole('button',{name:'Periksa jawaban'}).click();await expect(page.locator('#result')).toContainText('5 dari 5 jawaban benar');await expect(page.locator('.feedback.correct')).toHaveCount(5);
 await page.getByLabel('Jawabanmu').first().fill('4');await expect(page.locator('#result')).toBeEmpty();await page.getByRole('button',{name:'Periksa jawaban'}).click();await expect(page.locator('#result')).toContainText('4 dari 5');await expect(page.locator('#feedback-0')).toContainText('2 + 1 = 3');
 await page.reload();await expect(page.locator('#result')).toContainText('4 dari 5');await page.getByRole('link',{name:'Kembali ke katalog'}).click();await expect(page.locator('.worksheet-card').first()).toContainText('Selesai');
 await page.goto('/#worksheet/math-1');page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Ulangi worksheet'}).click();await page.reload();await expect(page.getByLabel('Jawabanmu').first()).toHaveValue('');
});
test('every worksheet opens, downloads a PDF; print hides app and answers',async({page,context},testInfo)=>{
 test.setTimeout(60000);for(const w of worksheets){const sheet=await context.newPage();await sheet.goto('/#worksheet/'+w.id);await expect(sheet.locator('.worksheet-heading h1')).toHaveText(w.title);await expect(sheet.locator('fieldset')).toHaveCount(5);const download=sheet.waitForEvent('download');await sheet.getByRole('button',{name:'Download PDF'}).click();const file=await download;expect(file.suggestedFilename()).toBe(`kelas-1-${w.id}.pdf`);const path=testInfo.outputPath(w.id+'.pdf');await file.saveAs(path);const bytes=await readFile(path);expect(bytes.toString('ascii')).toContain('%PDF-1.4');expect(bytes.toString('ascii')).toContain(w.title);expect(bytes.length).toBeGreaterThan(1000);await sheet.close();}
 await page.goto('/#worksheet/ppkn-5');
 await page.emulateMedia({media:'print'});await expect(page.locator('.print-sheet')).toBeVisible();await expect(page.locator('.site-header')).toBeHidden();await expect(page.locator('form')).toBeHidden();await expect(page.locator('.worksheet-toolbar')).toBeHidden();await expect(page.locator('.print-question')).toHaveCount(5);await expect(page.locator('.print-sheet')).not.toContainText('Jawabanmu');
});
test('keyboard operation and storage failure do not block answering',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}});});await page.goto('/#worksheet/math-1');const answer=page.getByLabel('Jawabanmu').first();await answer.focus();await page.keyboard.type('3');await expect(page.locator('#save-status')).toContainText('tidak tersedia');await expect(answer).toHaveValue('3');await page.getByRole('button',{name:'Periksa jawaban'}).focus();await page.keyboard.press('Enter');await expect(page.locator('#feedback-0')).toContainText('Benar');
});
test('clearing site storage removes progress; catalog PDF and print actions are wired',async({page})=>{
 await page.goto('/#worksheet/math-1');await page.getByLabel('Jawabanmu').first().fill('3');await page.evaluate(()=>localStorage.clear());await page.reload();await expect(page.getByLabel('Jawabanmu').first()).toHaveValue('');
 await page.evaluate(()=>{window.print=()=>{window.printRequested=true;};});await page.getByRole('button',{name:'Cetak',exact:true}).click();expect(await page.evaluate(()=>window.printRequested)).toBe(true);
 await page.getByRole('link',{name:'Kembali ke katalog'}).click();const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Download PDF Angka di sekitarku',exact:true}).click();expect((await downloaded).suggestedFilename()).toBe('kelas-1-math-1.pdf');
});
