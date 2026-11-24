const pages=[...document.querySelectorAll('.page')];
const tabs=[...document.querySelectorAll('.main-nav a')];
function showPage(){const requested=location.hash.replace('#','')||'home';const key=requested==='journal'?'portfolio':requested;const page=pages.find(p=>p.id===key)?key:'home';for(const item of pages)item.hidden=item.id!==page;for(const tab of tabs){if(tab.dataset.page===page)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current')}document.title=(page==='home'?'Home':page==='portfolio'?'Portfolio':page==='library'?'Book library':'Music')+' · Gia-Han Luu';window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',showPage);showPage();

const portfolioActivities=window.portfolioActivities||[];
const portfolioGroups=document.querySelector('#portfolio-groups');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const formatHighlightedText=(value,highlights=[])=>{
  const source=String(value);
  const phrases=[...new Set(highlights)].sort((a,b)=>b.length-a.length);
  if(!phrases.length)return escapeHtml(source);
  const matcher=new RegExp(phrases.map(phrase=>phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gi');
  let result='',cursor=0;
  for(const match of source.matchAll(matcher)){
    result+=escapeHtml(source.slice(cursor,match.index))+`<strong>${escapeHtml(match[0])}</strong>`;
    cursor=match.index+match[0].length;
  }
  return result+escapeHtml(source.slice(cursor));
};
function renderPortfolio(){
  if(!portfolioGroups)return;
  const entries=portfolioActivities.map(activity=>{
      const descriptions=activity.description.map(text=>`<p>${formatHighlightedText(text,activity.highlights)}</p>`).join('');
      const links=activity.links.map(link=>`<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} <span aria-hidden="true">↗</span></a>`).join('');
      const skills=(activity.skills||[]).map(skill=>`<span>${escapeHtml(skill)}</span>`).join('');
      const gallery=activity.gallery.map((image,index)=>`<div class="activity-gallery-slide"${index?' hidden':''}><button class="activity-gallery-image" type="button" data-certificate="${escapeHtml(image.src)}" data-title="${escapeHtml(image.alt)}" aria-label="View image: ${escapeHtml(image.alt)}"><img class="${image.fit==='contain'?'contain':''}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy"/></button></div>`).join('');
      const galleryNav=activity.gallery.length>1?`<button class="activity-gallery-nav" type="button" data-gallery-prev aria-label="Previous image">‹</button>`:'';
      const galleryNext=activity.gallery.length>1?`<button class="activity-gallery-nav" type="button" data-gallery-next aria-label="Next image">›</button>`:'';
      const gallerySection=gallery?`<div class="activity-gallery" data-gallery>${galleryNav}<div class="activity-gallery-stage" aria-live="polite">${gallery}</div>${galleryNext}</div>`:'';
      return `<article class="activity-item" data-category="${escapeHtml(activity.category)}" data-years="${activity.years.join(' ')}">
        <button class="activity-image" type="button" data-certificate="${escapeHtml(activity.image)}" data-title="${escapeHtml(activity.title)}" aria-label="View image: ${escapeHtml(activity.title)}"><img class="activity-thumb ${activity.fit==='contain'?'contain':''}" src="${escapeHtml(activity.image)}" alt="${escapeHtml(activity.alt)}" loading="lazy"/></button>
        <div class="activity-body"><div class="activity-meta"><span class="activity-type">${escapeHtml(activity.category)}</span><span>${escapeHtml(activity.year)}</span><span class="activity-status">${escapeHtml(activity.status)}</span></div>
          <h3>${escapeHtml(activity.title)}</h3><p class="activity-affiliation">${escapeHtml(activity.affiliation)}</p><p class="activity-excerpt">${formatHighlightedText(activity.excerpt,activity.highlights)}</p><div class="activity-skills" aria-label="Data science skills">${skills}</div>
          ${links?`<div class="activity-links">${links}</div>`:''}
        </div><details class="activity-details"><summary>My full story</summary><div class="activity-full">${descriptions}${gallerySection}</div></details></article>`;
  }).join('');
  portfolioGroups.innerHTML=`<div class="activity-list">${entries}</div>`;
}
renderPortfolio();

for(const gallery of document.querySelectorAll('[data-gallery]')){
  const slides=[...gallery.querySelectorAll('.activity-gallery-slide')];
  let current=0;
  const showSlide=index=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,slideIndex)=>slide.hidden=slideIndex!==current);
  };
  gallery.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>showSlide(current-1));
  gallery.querySelector('[data-gallery-next]')?.addEventListener('click',()=>showSlide(current+1));
}

const certificateDialog=document.querySelector('#certificate-dialog');
let certificateOpener=null;
document.querySelectorAll('[data-certificate]').forEach(button=>button.addEventListener('click',()=>{
  certificateOpener=button;
  const image=certificateDialog.querySelector('img');
  image.src=button.dataset.certificate;
  image.alt=button.dataset.title;
  certificateDialog.querySelector('#certificate-dialog-title').textContent=button.dataset.title;
  certificateDialog.showModal();
}));
function closeCertificate(){certificateDialog.close();certificateOpener?.focus()}
certificateDialog.querySelector('.dialog-close').addEventListener('click',closeCertificate);
certificateDialog.addEventListener('click',event=>{if(event.target===certificateDialog)closeCertificate()});

const activityCards=[...document.querySelectorAll('.activity-item')];
const categoryFilters=[...document.querySelectorAll('[data-category-filter]')];
const yearFilter=document.querySelector('#activity-year-filter');
const activityEmpty=document.querySelector('#activity-empty');
function filterActivities(){
  const category=categoryFilters.find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.categoryFilter||'all';
  const year=yearFilter.value;
  let visible=0;
  for(const card of activityCards){
    const categoryMatch=category==='all'||card.dataset.category===category;
    const yearMatch=year==='all'||card.dataset.years.split(/\s+/).includes(year);
    card.hidden=!(categoryMatch&&yearMatch);
    if(!card.hidden)visible++;
  }
  activityEmpty.hidden=visible!==0;
}
categoryFilters.forEach(button=>button.addEventListener('click',()=>{
  categoryFilters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  filterActivities();
}));
yearFilter.addEventListener('change',filterActivities);
filterActivities();
