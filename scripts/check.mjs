import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projects=JSON.parse(fs.readFileSync(path.join(root,'projects.json'),'utf8'));
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Duplicate project IDs');
const today=new Date().toISOString().slice(0,10);
let images=0;
for(const p of projects){
 assert(p.description.length>=80,`${p.id}: description missing`);
 assert(p.media.length>=2,`${p.id}: gallery incomplete`);
 assert.deepEqual(p.images,p.media.map(m=>m.src),`${p.id}: media indexes disagree`);
 if(p.featured){assert(p.caseStudy.length>=3,`${p.id}: case study missing`);assert(p.caseStudy.map(s=>s.text).join(' ').split(/\s+/).length>=200,`${p.id}: case study too short`);}
 for(const m of p.media){
  assert(/^assets\/screenshots\/[a-z0-9.-]+$/.test(m.src),`${p.id}: unsafe media path`);
  assert(fs.statSync(path.join(root,m.src)).size>500,`${p.id}: empty image`);
  assert(m.kind&&m.caption&&/^\d{4}-\d{2}-\d{2}$/.test(m.capturedAt),`${p.id}: missing provenance`);
  assert(m.capturedAt<=today,`${p.id}: future image date`);images++;
 }
 if(p.link){assert(p.link.startsWith('https://'));assert(!p.link.includes('chatgpt.site'),'Use verified custom/public project URLs');}
}
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(index.includes('DevilishDagon, an alias I use for privacy reasons'));
assert(!/\bDagon\b/.test(index),'Old shortened name');
console.log(JSON.stringify({projects:projects.length,repositories:new Set(projects.flatMap(p=>p.repositories)).size,caseStudies:projects.filter(p=>p.featured).length,images,checks:['unique IDs','substantial case studies','image files','dated provenance','safe paths','public links','privacy alias']},null,2));
