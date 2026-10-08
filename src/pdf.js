// Minimal PDF writer: standard Helvetica, no service, no network, no answer key.
const ascii=s=>s.replace(/[–—]/g,'-').replace(/…/g,'...').replace(/[^\x20-\x7e]/g,'');
const escape=s=>ascii(s).replace(/[()\\]/g,'\\$&');
function wrap(text,width=86){const lines=[];let line='';for(const word of ascii(text).split(/\s+/)){if((line+' '+word).trim().length>width){lines.push(line);line=word;}else line=(line+' '+word).trim();}if(line)lines.push(line);return lines;}
export function createPdf(w){
 const pages=[];let lines=[];const add=(s='')=>{for(const l of s?wrap(s):['']){if(lines.length>=45){pages.push(lines);lines=[];}lines.push(l);}};
 add('RUANG BELAJAR - DRAF PERTAMA');add(`Kelas 1 | ${w.subject==='math'?'Matematika':w.subject==='indonesia'?'Bahasa Indonesia':w.subject==='english'?'Bahasa Inggris':'PPKn'}`);add(w.title);add(w.topic);add('');add('Petunjuk: Baca soal. Lingkari pilihan atau tulis jawaban di ruang kosong.');add('');
 w.questions.forEach((q,i)=>{add(`${i+1}. ${q.prompt}`);if(q.options)q.options.forEach((o,j)=>add(`   ${String.fromCharCode(65+j)}. ${o}`));add('Jawaban: ________________________________________________________');add('');});add('Draf materi v'+w.version+' - perlu tinjauan guru sebelum digunakan sebagai acuan.');if(lines.length)pages.push(lines);
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];const ids=[];
 pages.forEach((page,i)=>{const id=objects.length+1;ids.push(id);const stream='BT\n/F1 11 Tf\n15 TL\n48 790 Td\n'+page.map((l,j)=>(j?'T*\n':'')+`(${escape(l)}) Tj`).join('\n')+'\nET';objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${id+1} 0 R >>`);objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);});objects[1]=`<< /Type /Pages /Kids [${ids.map(id=>`${id} 0 R`).join(' ')}] /Count ${ids.length} >>`;
 let pdf='%PDF-1.4\n';const offsets=[0];objects.forEach((obj,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`;});const xref=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(o=>`${String(o).padStart(10,'0')} 00000 n \n`).join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;return new TextEncoder().encode(pdf);
}
export function downloadPdf(w){const url=URL.createObjectURL(new Blob([createPdf(w)],{type:'application/pdf'}));const a=document.createElement('a');a.href=url;a.download=`kelas-1-${w.id}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
