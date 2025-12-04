// Basic interactivity for the site

// Theme toggle (applies to whole site)
function initThemeToggles(){
  const toggles = document.querySelectorAll('[id^="theme-toggle"]');
  toggles.forEach(btn=>btn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    const active = document.body.classList.contains('dark');
    btn.textContent = active ? 'Modo claro' : 'Modo oscuro';
  }));
}
document.addEventListener('DOMContentLoaded', ()=>{
  initThemeToggles();
  initForm();
  initCarousel();
  initPanelControls();
});

// Form handling and list management (persists in localStorage)
function initForm(){
  const form = document.getElementById('person-form');
  if(!form) return;
  const listEl = document.getElementById('people-list');
  const storageKey = 'people_list_v1';
  // Load saved
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  saved.forEach(p=>addPersonToDOM(p));

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const age = form.age.value.trim();
    const notes = form.notes.value.trim();
    // Basic JS validation
    const errors = [];
    if(name.length < 3) errors.push('El nombre debe tener al menos 3 caracteres');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Correo con formato inválido');
    if(!(Number(age) >= 1 && Number(age) <= 120)) errors.push('Edad fuera de rango');
    if(notes.length > 300) errors.push('Notas max 300 caracteres');
    if(errors.length){
      alert('Errores:\n' + errors.join('\n'));
      return;
    }
    const person = {id:Date.now(),name,email,age,notes};
    saved.push(person);
    localStorage.setItem(storageKey, JSON.stringify(saved));
    addPersonToDOM(person);
    form.reset();
  });

  document.getElementById('clear-list').addEventListener('click', ()=>{
    if(confirm('¿Limpiar toda la lista?')){
      localStorage.removeItem(storageKey);
      listEl.innerHTML='';
    }
  });

  function addPersonToDOM(p){
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.email)} — ${p.age} años
      <button class="btn small" data-id="${p.id}" style="margin-left:.6rem">Eliminar</button>`;
    listEl.appendChild(li);
    li.querySelector('button').addEventListener('click', ()=>{
      const arr = JSON.parse(localStorage.getItem(storageKey) || '[]').filter(x=>x.id!==p.id);
      localStorage.setItem(storageKey, JSON.stringify(arr));
      li.remove();
    });
  }
}

// Simple escape
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// Carousel implementation & thumbs
function initCarousel(){
  const carousel = document.getElementById('carousel');
  if(!carousel) return;
  const slides = carousel.querySelectorAll('.slides img');
  const thumbs = document.getElementById('thumbs');
  let idx = 0;
  slides.forEach((img,i)=>{
    const t = img.cloneNode();
    t.classList.remove('active');
    t.width = 120;
    t.addEventListener('click', ()=>{ show(i); });
    thumbs.appendChild(t);
  });
  function show(i){
    slides.forEach(s=>s.classList.remove('active'));
    slides[i].classList.add('active');
    const thimgs = thumbs.querySelectorAll('img');
    thimgs.forEach(t=>t.classList.remove('selected'));
    thimgs[i].classList.add('selected');
    idx = i;
  }
  show(0);
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  next.addEventListener('click', ()=> show((idx+1)%slides.length));
  prev.addEventListener('click', ()=> show((idx-1+slides.length)%slides.length));
  // auto-advance
  setInterval(()=> show((idx+1)%slides.length), 5000);
}

// Panel controls (calculator + show/hide)
function initPanelControls(){
  const go = document.getElementById('calc-go');
  if(go){
    go.addEventListener('click', ()=>{
      const a = Number(document.getElementById('calc-a').value || 0);
      const b = Number(document.getElementById('calc-b').value || 0);
      const op = document.getElementById('calc-op').value;
      let res = '—';
      if(op==='+') res = a + b;
      if(op==='-') res = a - b;
      if(op==='*') res = a * b;
      if(op==='/' ) res = b===0 ? 'Error (div/0)' : a / b;
      document.getElementById('calc-result').textContent = res;
    });
  }
  const toggle = document.getElementById('toggle-info');
  if(toggle){
    const box = document.getElementById('extra-info');
    toggle.addEventListener('click', ()=>{
      if(box.classList.contains('hidden')){
        box.classList.remove('hidden');
        toggle.textContent = 'Ocultar info';
      } else {
        box.classList.add('hidden');
        toggle.textContent = 'Mostrar info';
      }
    });
  }
}
