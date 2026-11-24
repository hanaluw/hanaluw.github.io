const pages=[...document.querySelectorAll('.page')];
const tabs=[...document.querySelectorAll('.main-nav a')];
function showPage(){const requested=location.hash.replace('#','')||'home';const key=requested==='journal'?'portfolio':requested;const page=pages.find(p=>p.id===key)?key:'home';for(const item of pages)item.hidden=item.id!==page;for(const tab of tabs){if(tab.dataset.page===page)tab.setAttribute('aria-current','page');else tab.removeAttribute('aria-current')}document.title=(page==='home'?'Home':page==='portfolio'?'Portfolio':page==='library'?'Book library':'Music')+' · Gia-Han Luu';window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',showPage);showPage();
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
