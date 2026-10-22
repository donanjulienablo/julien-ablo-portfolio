const menu=document.querySelector('.menu-button');const nav=document.querySelector('.nav-links');
function closeMenu(restoreFocus=false){if(!menu||!nav)return;menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.textContent='Menu';if(restoreFocus)menu.focus();}
if(menu&&nav){
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.textContent=open?'Fermer':'Menu';});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
 document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
 window.matchMedia('(min-width:981px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
}
const filters=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('.project-card')];
const search=document.querySelector('#project-search');
const domain=document.querySelector('#project-domain');
const params=new URLSearchParams(location.search);
const normalize=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let selected=filters.find(b=>normalize(b.dataset.filter)===normalize(params.get('type')))?.dataset.filter||'Tout';
if(domain&&[...domain.options].some(o=>o.value===params.get('domaine')))domain.value=params.get('domaine');
if(search)search.value=params.get('q')||'';
function filterProjects(){
 const term=normalize(search?.value);
 const chosenDomain=domain?.value||'Tout';
 let count=0;
 cards.forEach(c=>{
  const show=(selected==='Tout'||c.dataset.type===selected)&&(chosenDomain==='Tout'||c.dataset.category===chosenDomain)&&normalize(c.dataset.search).includes(term);
  c.hidden=!show;
  if(show)count++;
 });
 filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===selected)));
 const counter=document.querySelector('#result-count');
 if(counter)counter.textContent=count+' fiche'+(count!==1?'s':'')+' à explorer';
 const empty=document.querySelector('#empty');
 if(empty)empty.hidden=count!==0;
 const graphicNote=document.querySelector('#graphic-note');
 if(graphicNote)graphicNote.hidden=!(selected==='Graphisme'||chosenDomain==='Graphisme');
}
function syncProjectURL(){
 const url=new URL(location.href);
 if(selected==='Tout')url.searchParams.delete('type');else url.searchParams.set('type',selected);
 if(!domain||domain.value==='Tout')url.searchParams.delete('domaine');else url.searchParams.set('domaine',domain.value);
 if(!search?.value.trim())url.searchParams.delete('q');else url.searchParams.set('q',search.value.trim());
 history.replaceState(null,'',url);
}
filters.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;filterProjects();syncProjectURL();}));
search?.addEventListener('input',()=>{filterProjects();syncProjectURL();});
domain?.addEventListener('change',()=>{filterProjects();syncProjectURL();});
if(filters.length)filterProjects();
document.querySelector('[data-reset-filters]')?.addEventListener('click',()=>{selected='Tout';if(domain)domain.value='Tout';if(search)search.value='';filterProjects();syncProjectURL();search?.focus();});
if(search){
 const key='portfolio-project-return';
 try{
  const saved=JSON.parse(sessionStorage.getItem(key)||'null');
  if(saved&&saved.url===location.pathname+location.search&&saved.id){requestAnimationFrame(()=>document.getElementById(saved.id)?.focus({preventScroll:true}));}
  cards.forEach((card,index)=>{const a=card.querySelector('a');if(!a)return;a.id='project-link-'+index;a.addEventListener('click',()=>sessionStorage.setItem(key,JSON.stringify({url:location.pathname+location.search,id:a.id})));});
 }catch{}
}
document.querySelector('[data-project-return]')?.addEventListener('click',e=>{try{const saved=JSON.parse(sessionStorage.getItem('portfolio-project-return')||'null');if(saved?.url&&/\/projets\.html(?:\?|$)/.test(saved.url)){e.preventDefault();location.href=saved.url;}}catch{}});
document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',async()=>{const out=b.parentElement.querySelector('.share-status');try{if(navigator.share){await navigator.share({title:document.title,url:location.href});out.textContent='';}else{await navigator.clipboard.writeText(location.href);out.textContent='Lien copié. Vous pouvez le partager.';}}catch(e){if(e.name!=='AbortError')out.textContent='Copiez le lien depuis la barre d’adresse.';}}));
const dialog=document.querySelector('#gallery-dialog');
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
 if(!dialog)return;
 const artwork=dialog.querySelector('img');
 artwork.src=button.dataset.image;
 artwork.alt=button.dataset.gallery;
 dialog.querySelector('p').textContent=button.dataset.caption||button.dataset.gallery;
 const fullImage=dialog.querySelector('[data-full-image]');
 if(fullImage)fullImage.href=button.dataset.image;
 dialog.showModal();
}));
dialog?.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{
 if(event.target!==dialog)return;
 const rect=dialog.getBoundingClientRect();
 if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
});
