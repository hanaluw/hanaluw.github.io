const pages=[...document.querySelectorAll('.page')];
const tabs=[...document.querySelectorAll('.main-nav a')];
function showPage(){const requested=location.hash.replace('#','')||'home';const key=requested==='journal'?'portfolio':requested;const page=pages.find(p=>p.id===key)?key:'home';for(const item of pages)item.hidden=item.id!==page;for(const tab of tabs){if(tab.dataset.page===page)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current')}document.title=(page==='home'?'Home':page==='portfolio'?'Portfolio':page==='library'?'Book library':'Music')+' · Gia-Han Luu';window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',showPage);showPage();

const portfolioActivities=window.portfolioActivities||[];
const portfolioGroups=document.querySelector('#portfolio-groups');
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderPortfolio(){
  if(!portfolioGroups)return;
  const entries=portfolioActivities.map(activity=>{
      const descriptions=activity.description.map(text=>`<p>${escapeHtml(text)}</p>`).join('');
      const links=activity.links.map(link=>`<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} <span aria-hidden="true">↗</span></a>`).join('');
      const skills=(activity.skills||[]).map(skill=>`<span>${escapeHtml(skill)}</span>`).join('');
      const gallery=activity.gallery.map(image=>`<button class="activity-gallery-image" type="button" data-certificate="${escapeHtml(image.src)}" data-title="${escapeHtml(image.alt)}" aria-label="View image: ${escapeHtml(image.alt)}"><img class="${image.fit==='contain'?'contain':''}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy"/></button>`).join('');
      const gallerySection=gallery?`<div class="activity-gallery"><div class="activity-gallery-grid">${gallery}</div></div>`:'';
      return `<article class="activity-item" data-category="${escapeHtml(activity.category)}" data-years="${activity.years.join(' ')}">
        <button class="activity-image" type="button" data-certificate="${escapeHtml(activity.image)}" data-title="${escapeHtml(activity.title)}" aria-label="View image: ${escapeHtml(activity.title)}"><img class="activity-thumb ${activity.fit==='contain'?'contain':''}" src="${escapeHtml(activity.image)}" alt="${escapeHtml(activity.alt)}" loading="lazy"/></button>
        <div class="activity-body"><div class="activity-meta"><span class="activity-type">${escapeHtml(activity.category)}</span><span>${escapeHtml(activity.year)}</span><span class="activity-status">${escapeHtml(activity.status)}</span></div>
          <h3>${escapeHtml(activity.title)}</h3><p class="activity-affiliation">${escapeHtml(activity.affiliation)}</p><p class="activity-excerpt">${escapeHtml(activity.excerpt)}</p><div class="activity-skills" aria-label="Data science skills">${skills}</div>
          ${links?`<div class="activity-links">${links}</div>`:''}
        </div><details class="activity-details"><summary>My full story</summary><div class="activity-full">${descriptions}${gallerySection}</div></details></article>`;
  }).join('');
  portfolioGroups.innerHTML=`<div class="activity-list">${entries}</div>`;
}
renderPortfolio();

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
