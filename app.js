const menu=document.querySelector('.menu-button');const nav=document.querySelector('.nav-links');if(menu&&nav)menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
const filters=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('.project-card')];
const search=document.querySelector('#project-search');
const domain=document.querySelector('#project-domain');
const params=new URLSearchParams(location.search);
const normalize=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let selected=filters.find(b=>normalize(b.dataset.filter)===normalize(params.get('type')))?.dataset.filter||'Tout';
if(domain&&[...domain.options].some(o=>o.value===params.get('domaine')))domain.value=params.get('domaine');
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
 history.replaceState(null,'',url);
}
filters.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;filterProjects();syncProjectURL();}));
search?.addEventListener('input',filterProjects);
domain?.addEventListener('change',()=>{filterProjects();syncProjectURL();});
if(filters.length)filterProjects();
document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',async()=>{const out=b.parentElement.querySelector('.share-status');try{if(navigator.share){await navigator.share({title:document.title,url:location.href});out.textContent='';}else{await navigator.clipboard.writeText(location.href);out.textContent='Lien copié. Vous pouvez le partager.';}}catch(e){if(e.name!=='AbortError')out.textContent='Copiez le lien depuis la barre d’adresse.';}}));
const dialog=document.querySelector('#gallery-dialog');document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{if(!dialog)return;dialog.querySelector('img').src=b.dataset.image;dialog.querySelector('img').alt=b.dataset.gallery;dialog.querySelector('p').textContent=b.dataset.gallery+' — Concept visuel généré par IA, présenté à titre illustratif.';dialog.showModal();}));dialog?.querySelector('.close').addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
