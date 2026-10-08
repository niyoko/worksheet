import test from 'node:test';
import assert from 'node:assert/strict';
import { worksheets, subjects } from '../src/data.js';
import { evaluate, status, saveProgress, loadProgress, progressKey } from '../src/progress.js';
import { createPdf } from '../src/pdf.js';
test('20 original grade-one drafts, five per subject, valid questions and answers', () => {
 assert.equal(worksheets.length,20); assert.equal(new Set(worksheets.map(w=>w.id)).size,20);
 for(const s of subjects) assert.equal(worksheets.filter(w=>w.subject===s.id).length,5);
 for(const w of worksheets){ assert.equal(w.grade,1); assert.equal(w.publicationStatus,'draft'); assert.ok(w.version); assert.equal(w.questions.length,5); for(const q of w.questions){assert.ok(q.prompt);assert.ok(q.explanation);assert.ok(q.answers.length);if(q.options)assert.ok(q.options.includes(q.answers[0]));assert.equal(evaluate(q,q.answers[0]),true);assert.equal(evaluate(q,''),false);}}
});
test('normalized answers, scoring and completion require checked answers',()=>{
 assert.equal(evaluate({answers:['cat']},' CAT '),true);
 const w=worksheets[0]; assert.equal(status(w,{}).state,'new');
 const answers=Object.fromEntries(w.questions.map((q,i)=>[i,q.answers[0]]));
 assert.equal(status(w,{answers}).state,'active');
 const result=status(w,{answers,checked:true});assert.equal(result.state,'done');assert.equal(result.score,5);
 answers[0]='wrong';assert.equal(status(w,{answers,checked:true}).score,4);
});
test('local progress survives reload, versions isolate data, corrupt/unavailable storage is safe',()=>{
 const map=new Map();const storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};const w=worksheets[0];
 assert.equal(saveProgress(storage,w,{answers:{0:'2'},checked:false}),true);assert.equal(loadProgress(storage,w).answers[0],'2');
 assert.notEqual(progressKey(w),progressKey({...w,version:'2'}));map.set(progressKey(w),'broken');assert.deepEqual(loadProgress(storage,w),{answers:{},checked:false});
 assert.equal(saveProgress({setItem(){throw Error();}},w,{}),false);
});
test('PDF is a real self-contained document with all questions and no answer key or controls',()=>{
 for(const w of worksheets){const pdf=new TextDecoder().decode(createPdf(w));assert.ok(pdf.startsWith('%PDF-1.4'));assert.ok(pdf.endsWith('%%EOF\n'));assert.ok(pdf.includes('xref'));assert.ok(pdf.includes(w.title));for(const q of w.questions)assert.ok(pdf.includes(q.prompt.replace(/[()\\]/g,'\\$&')));assert.ok(!pdf.includes('Download PDF'));assert.ok(!pdf.includes('Kunci jawaban'));assert.ok(!pdf.includes('/JavaScript'));}
});
test('PDF cross-reference offsets and stream lengths point to valid objects',()=>{
 for(const w of worksheets){const pdf=new TextDecoder().decode(createPdf(w));const xref=Number(pdf.match(/startxref\n(\d+)/)[1]);assert.equal(pdf.slice(xref,xref+4),'xref');const entries=pdf.slice(xref).split('\n');const count=Number(entries[1].split(' ')[1]);for(let i=1;i<count;i++){const offset=Number(entries[2+i].slice(0,10));assert.ok(pdf.slice(offset).startsWith(`${i} 0 obj\n`));}for(const m of pdf.matchAll(/\/Length (\d+) >>\nstream\n([\s\S]*?)\nendstream/g))assert.equal(m[2].length,Number(m[1]));}
});
