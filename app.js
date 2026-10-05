'use strict';
const $=s=>document.querySelector(s);
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let projects=[],category='All projects';
const dialog=$('#project-dialog');
function captureType(p){return p.capture.startsWith('Documentation')?'Project documentation':p.capture.startsWith('Firmware')?'Firmware preview':'Interface capture';}
function render(){
 const query=$('#search').value.trim().toLowerCase();
 const filtered=projects.filter(p=>(category==='All projects'||p.category===category)&&[p.title,p.tagline,p.description,...p.stack,...p.repositories].join(' ').toLowerCase().includes(query));
 $('#result-count').textContent=`${filtered.length} of ${projects.length} projects`;
 $('#empty').hidden=filtered.length!==0;
 $('#project-grid').innerHTML=filtered.map(p=>`<article class="project-card" id="card-${p.id}"><button class="project-image" data-project="${p.id}" aria-label="View ${escapeHTML(p.title)} details and screenshots"><img src="${p.images[0]}" alt="${escapeHTML(p.title)} — ${escapeHTML(p.capture)}" width="1440" height="1000" loading="lazy"><span class="image-label">${captureType(p)}</span></button><div class="project-meta"><span>${escapeHTML(p.category)}</span><span class="project-number">${String(projects.indexOf(p)+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span></div><h3><button data-project="${p.id}">${escapeHTML(p.title)}</button></h3><p>${escapeHTML(p.tagline)}</p><div class="project-stack">${p.stack.slice(0,3).map(escapeHTML).join(' / ')}</div></article>`).join('');
}
function openProject(id){
 const p=projects.find(x=>x.id===id);if(!p)return;
 $('#dialog-category').textContent=p.category+' / '+p.status;
 $('#dialog-content').innerHTML=`<h2 id="dialog-title">${escapeHTML(p.title)}</h2><p class="dialog-description">${escapeHTML(p.description)}</p><div class="dialog-tags">${p.stack.map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div><div class="detail-grid"><div><h3>What it does</h3><ul>${p.features.map(f=>`<li>${escapeHTML(f)}</li>`).join('')}</ul></div><div><h3>Project notes</h3><p>${escapeHTML(p.status)}. ${['metis-public-site','portfolio'].includes(p.id)?'Public source available on GitHub.':'Application source is kept private.'}</p><p>${p.capture.startsWith('Documentation')?'The images below show public-safe project documentation. Application screenshots are not available in this gallery.':p.capture.startsWith('Firmware')?'These images are firmware-rendered previews, rather than photographs of the hardware.':'These captures show the project interface using an isolated local copy or demonstration data.'}</p>${p.link?`<a class="detail-link" href="${escapeHTML(p.link)}" target="_blank" rel="noopener noreferrer">Visit project</a>`:''}${['metis-public-site','portfolio'].includes(p.id)?`<a class="detail-link" href="https://github.com/DevilishDagon/${p.repositories[0]}" target="_blank" rel="noopener noreferrer">View source</a>`:''}</div></div><div class="gallery">${p.images.map((src,i)=>`<figure><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHTML(p.title)} capture ${i+1} at full size"><img src="${src}" alt="${escapeHTML(p.title)} capture ${i+1}: ${escapeHTML(p.capture)}" width="1440" height="1000"></a><figcaption>${String(i+1).padStart(2,'0')} / ${escapeHTML(p.capture)}</figcaption></figure>`).join('')}</div><p class="gallery-note">Select an image to view it at full size.</p>`;
 if(!dialog.open)dialog.showModal();
 document.body.classList.add('modal-open');dialog.scrollTop=0;
 history.replaceState(null,'','#project='+encodeURIComponent(id));
}
$('#project-grid').addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(b)openProject(b.dataset.project);});
$('#filters').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;category=b.dataset.category;document.querySelectorAll('#filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();});
$('#search').addEventListener('input',render);
$('#reset').addEventListener('click',()=>{$('#search').value='';$('#filters button').click();$('#search').focus();});
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(location.hash.startsWith('#project='))history.replaceState(null,'','#projects');});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project='))openProject(decodeURIComponent(location.hash.slice(9)));});
fetch('projects.json').then(r=>{if(!r.ok)throw Error('Project index unavailable');return r.json();}).then(data=>{
 projects=data;$('#hero-count').textContent=String(projects.length).padStart(2,'0');
 const categories=['All projects',...new Set(projects.map(p=>p.category))];
 $('#filters').innerHTML=categories.map((name,i)=>`<button data-category="${escapeHTML(name)}" aria-pressed="${i===0}">${escapeHTML(name)}</button>`).join('');
 render();if(location.hash.startsWith('#project='))openProject(decodeURIComponent(location.hash.slice(9)));
}).catch(()=>{$('#load-error').hidden=false;});
