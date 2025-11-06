const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle?.addEventListener('click', ()=>{
  const open = menu.style.display === 'flex';
  menu.style.display = open ? 'none' : 'flex';
  toggle.setAttribute('aria-expanded', String(!open));
});