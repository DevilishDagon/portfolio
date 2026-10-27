import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projects=JSON.parse(fs.readFileSync(path.join(root,'projects.json'),'utf8'));
const latest=projects.map(p=>p.reviewedAt||'2026-10-05').sort().at(-1);
const count=new Set(projects.flatMap(p=>p.repositories)).size;
const readme=['# DevilishDagon — Projects & experiments','','DevilishDagon is an alias I use for privacy reasons.','',
'**[Explore the portfolio](https://devilishdagon.github.io/portfolio/)** · [GitHub profile](https://github.com/DevilishDagon)','',
`${projects.length} projects, including ${projects.filter(p=>p.featured).length} detailed case studies. The directory covers ${count} GitHub repositories plus local projects. Private application source stays private. Latest substantive source review: ${latest}.`,'',
'Every gallery image has a type, date and caption. Real screenshots, fictional-data demonstrations, original artwork, diagrams and retained documentation previews are distinguished. See [image provenance](CAPTURES.md).','',
'## Selected work',''];
for(const p of projects.filter(p=>p.featured))readme.push(`- [${p.title}](https://devilishdagon.github.io/portfolio/#project=${p.id}) — ${p.tagline}`);
readme.push('','## Project directory','');
const notes=['# Image provenance','',`Latest portfolio review: ${latest}. Image dates describe capture or creation, not deployment or physical-device verification.`,'',
'New interface captures use public demos or isolated copies with fictional records. The XBNL copy removes employee names and internal links. Contractstudio uses fictional customers and invented tariffs. No source connectors, private accounts or hardware were changed for these captures.','',
'Metis is now represented by diagrams of the native app and its action flow. A fresh sanitized iPhone screenshot remains unavailable. Historical display and documentation images keep their original dates. Original campaign artwork contains geography only, not private scene text or DM notes.',''];
for(const p of projects){
 readme.push(`## ${p.title}`,'',p.description,'',`**Type:** ${p.status} · **Technologies:** ${p.stack.join(', ')}`,'');
 if(p.reviewedAt)readme.push(`Source reviewed: ${p.reviewedAt}.`,'');
 for(const s of p.caseStudy||[])readme.push(`### ${s.title}`,'',s.text,'');
 readme.push('**Capabilities**','',...p.features.map(f=>'- '+f),'',`[Open project details](https://devilishdagon.github.io/portfolio/#project=${p.id})`+(p.link?` · [${p.linkLabel||'Visit project'}](${p.link})`:''),'',p.mediaNote,'');
 notes.push(`## ${p.title}`,'',p.mediaNote,'','| File | Type | Captured / created | Caption |','| --- | --- | --- | --- |');
 for(const m of p.media){
  if(m.src.endsWith('.gif'))readme.push(`[View animation](${m.src})`,'');
  else readme.push(`![${p.title}: ${m.caption}](${m.src})`,'');
  readme.push(`*${m.kind} · ${m.capturedAt}. ${m.caption}*`,'');
  notes.push(`| [${path.basename(m.src)}](${m.src}) | ${m.kind} | ${m.capturedAt} | ${m.caption.replaceAll('|','/')} |`);
 }
 notes.push('');
}
readme.push('## Maintenance','','Edit `projects.json`, then run `node scripts/build-directory.mjs` and `node scripts/check.mjs`. The site uses plain HTML, CSS and JavaScript. GitHub Pages publishes the root of `main`. Read [maintenance guidance](MAINTENANCE.md) before publishing.','');
fs.writeFileSync(path.join(root,'README.md'),readme.join('\n'));
fs.writeFileSync(path.join(root,'CAPTURES.md'),notes.join('\n'));
console.log(`Generated directory and provenance for ${projects.length} projects.`);
