// Eventos de ejemplo (editable)
const events = {
  "2025-11-10": ["Guardia reforzada", "Pediatría por orden de llegada"],
  "2025-11-12": ["Cardiología AM", "Laboratorio sin turno 07:00-09:00"],
};

const calendarEl = document.getElementById('calendar');
const monthLabel = document.getElementById('monthLabel');
const fechaInput = document.getElementById('fecha');
const form = document.getElementById('formTurno');
const msg = document.getElementById('msg');

let viewDate = new Date();

function ymd(date){ return date.toISOString().slice(0,10); }
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }

function render(){
  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const firstWeekday = (start.getDay() + 6) % 7; // Lunes=0
  const days = end.getDate();
  monthLabel.textContent = start.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const weekdays = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  let html = `<div class="row head">${weekdays.map(d=>`<div>${d}</div>`).join('')}</div>`;

  let cells = [];
  for (let i=0;i<firstWeekday;i++) cells.push(`<button class="day empty" disabled></button>`);
  for (let day=1; day<=days; day++){
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const key = ymd(d);
    const evs = events[key] || [];
    const badges = evs.slice(0,2).map(e=>`<span class="badge" title="${e}">●</span>`).join('');
    cells.push(`<button class="day" data-date="${key}" aria-label="${key}"><strong>${day}</strong> ${badges}</button>`);
  }

  let rows = [];
  for (let i=0;i<cells.length;i+=7){ rows.push(`<div class="row">${cells.slice(i,i+7).join('')}</div>`); }
  calendarEl.innerHTML = rows.join('');

  calendarEl.querySelectorAll('.day[data-date]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      fechaInput.value = btn.dataset.date;
      document.getElementById('reserva').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}

document.getElementById('prev').addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()-1); render(); });
document.getElementById('next').addEventListener('click', ()=>{ viewDate.setMonth(viewDate.getMonth()+1); render(); });

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const turno = {
    fecha: fechaInput.value,
    nombre: document.getElementById('nombre').value.trim(),
    especialidad: document.getElementById('especialidad').value
  };
  if (!turno.fecha || !turno.nombre || !turno.especialidad) return;
  const key = 'turnos';
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  data.push(turno);
  localStorage.setItem(key, JSON.stringify(data));
  msg.hidden = false;
  form.reset();
});

render();