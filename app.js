'use strict';
const $=s=>document.querySelector(s);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=value=>new Date(value+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
let projects=[],category='All projects',returnFocus=null;
const dialog=$('#project-dialog');
const mediaFor=p=>p.media||p.images.map(src=>({src,kind:p.capture,caption:p.capture,capturedAt:'2026-10-05'}));
function render(){
 const query=$('#search').value.trim().toLowerCase();
 const filtered=projects.filter(p=>(category==='All projects'||p.category===category)&&[p.title,p.tagline,p.description,...p.stack,...p.repositories,...(p.caseStudy||[]).map(x=>x.text)].join(' ').toLowerCase().includes(query));
 $('#result-count').textContent=`${filtered.length} of ${projects.length} projects`;
 $('#empty').hidden=filtered.length!==0;
 $('#project-grid').innerHTML=filtered.map(p=>{
  const m=mediaFor(p)[0];
  return `<article class="project-card" id="card-${esc(p.id)}"><button class="project-image" data-project="${esc(p.id)}" aria-label="View ${esc(p.title)} details and images"><img src="${esc(m.src)}" alt="${esc(p.title)} — ${esc(m.kind)}" width="1440" height="960" loading="lazy"><span class="image-label">${esc(m.kind)}</span></button><div class="project-meta"><span>${esc(p.category)}</span><span>${p.featured?'CASE STUDY':String(projects.indexOf(p)+1).padStart(2,'0')}</span></div><h3><button data-project="${esc(p.id)}">${esc(p.title)}</button></h3><p>${esc(p.tagline)}</p><div class="project-stack">${p.stack.slice(0,3).map(esc).join(' / ')}</div></article>`;
 }).join('');
}
function renderFeatured(){
 $('#featured-grid').innerHTML=projects.filter(p=>['metis','mnemosyne','kpi-dashboard'].includes(p.id)).map((p,i)=>{
  const m=mediaFor(p)[0];
  return `<article class="featured-card"><button class="featured-image" data-project="${esc(p.id)}" aria-label="Read ${esc(p.title)} case study"><img src="${esc(m.src)}" alt="${esc(m.caption)}" width="1440" height="960"><span class="image-label">${esc(m.kind)}</span></button><div class="featured-copy"><span class="eyebrow">0${i+1} / ${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><button class="text-link" data-project="${esc(p.id)}">Read the full case study <span aria-hidden="true">↗</span></button></div></article>`;
 }).join('');
}
function openProject(id){
 const p=projects.find(x=>x.id===id);if(!p)return;
 if(!dialog.open)returnFocus=document.activeElement;
 $('#dialog-category').textContent=p.category+' / '+p.status;
 const media=mediaFor(p);
 const gallery=media.map((m,i)=>{
  const motion=m.src.endsWith('.gif');
  return `<figure><a href="${esc(m.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(p.title)} image ${i+1} at full size"><img src="${esc(motion?media[0].src:m.src)}" alt="${esc(m.caption)}" width="1440" height="960" loading="lazy" ${motion?'data-motion-image':''}></a>${motion?`<button class="motion-toggle" data-motion="${esc(m.src)}" data-poster="${esc(media[0].src)}" aria-pressed="false">Play animation</button>`:''}<figcaption><strong>${esc(m.kind)} · ${date(m.capturedAt)}</strong><span>${esc(m.caption)}</span></figcaption></figure>`;
 }).join('');
 $('#dialog-content').innerHTML=`<h2 id="dialog-title">${esc(p.title)}</h2><p class="dialog-description">${esc(p.description)}</p>${p.reviewedAt?`<p class="review-date">Source reviewed ${date(p.reviewedAt)}</p>`:''}<div class="dialog-tags">${p.stack.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>${p.caseStudy?`<div class="case-study">${p.caseStudy.map(s=>`<section><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></section>`).join('')}</div>`:''}<div class="detail-grid"><div><h3>What it does</h3><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul></div><div><h3>Project notes</h3><p>${esc(p.status)}. ${['metis-public-site','portfolio'].includes(p.id)?'Public source available on GitHub.':'Application source is kept private.'}</p>${p.link?`<a class="detail-link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">${esc(p.linkLabel||'Visit project')}</a>`:''}${['metis-public-site','portfolio'].includes(p.id)?`<a class="detail-link" href="https://github.com/DevilishDagon/${p.repositories[0]}" target="_blank" rel="noopener noreferrer">View source</a>`:''}</div></div><section class="media-section" aria-label="Project images"><h3>Inside the project</h3><p class="media-note">${esc(p.mediaNote)}</p><div class="gallery">${gallery}</div><p class="gallery-note">Select an image to view it at full size. Dates identify when the image was captured or created.</p></section>`;
 if(!dialog.open)dialog.showModal();
 document.body.classList.add('modal-open');dialog.scrollTop=0;
 $('#close-dialog').focus({preventScroll:true});
 history.replaceState(null,'','#project='+encodeURIComponent(id));
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-project]');if(b)openProject(b.dataset.project);
 const motion=e.target.closest('[data-motion]');if(motion){
  const playing=motion.getAttribute('aria-pressed')!=='true';
  motion.closest('figure').querySelector('[data-motion-image]').src=playing?motion.dataset.motion:motion.dataset.poster;
  motion.setAttribute('aria-pressed',String(playing));motion.textContent=playing?'Stop animation':'Play animation';
 }
});
$('#filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;category=b.dataset.category;document.querySelectorAll('#filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});
$('#search').addEventListener('input',render);
$('#reset').addEventListener('click',()=>{$('#search').value='';$('#filters button').click();$('#search').focus();});
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(location.hash.startsWith('#project='))history.replaceState(null,'','#projects');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project='))openProject(decodeURIComponent(location.hash.slice(9)));});
fetch('projects.json').then(r=>{if(!r.ok)throw Error('Project index unavailable');return r.json();}).then(data=>{
 projects=data;$('#hero-count').textContent=String(projects.length).padStart(2,'0');
 $('#case-count').textContent=projects.filter(p=>p.featured).length+' detailed case studies';
 const categories=['All projects',...new Set(projects.map(p=>p.category))];
 $('#filters').innerHTML=categories.map((name,i)=>`<button data-category="${esc(name)}" aria-pressed="${i===0}">${esc(name)}</button>`).join('');
 render();renderFeatured();if(location.hash.startsWith('#project='))openProject(decodeURIComponent(location.hash.slice(9)));
}).catch(()=>{$('#load-error').hidden=false;});
