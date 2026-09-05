const CORREO_DESTINO = "annelpz@hotmail.com";


const HORA_DEFINIDA = true;
const FECHA_EVENTO = new Date(2026, 8, 12, 18, 0, 0); 

const HERO_IMAGE = "images/hero.jpg";


const envelopeScreen = document.getElementById("envelope-screen");
const sigilBtn = document.getElementById("sigilBtn");
const burst = document.getElementById("burst");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

function createBurstParticles() {
  const colors = ["#b5893a", "#d8bd82", "#fffdf8", "#e7d4a8"];
  burst.innerHTML = "";
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const angle = (Math.PI * 2 * i) / count;
    const distance = 100 + Math.random() * 120;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    p.style.background = colors[i % colors.length];
    p.style.setProperty("--x", `${x}px`);
    p.style.setProperty("--y", `${y}px`);
    p.style.animation = `particle-fly 0.9s ease-out forwards`;
    p.style.animationDelay = `${Math.random() * 0.08}s`;
    burst.appendChild(p);
  }
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes particle-fly {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(0.3); opacity: 0; }
}`;
document.head.appendChild(styleSheet);

function openInvitation() {
  createBurstParticles();
  burst.classList.add("is-active");

  bgMusic.play().then(() => {
    musicToggle.classList.add("is-playing");
  }).catch(() => {
    // El navegador puede bloquear el autoplay; no pasa nada.
  });

  setTimeout(() => {
    envelopeScreen.classList.add("is-hidden");
    document.body.style.overflow = "auto";
  }, 350);

  setTimeout(() => {
    burst.classList.remove("is-active");
  }, 900);
}

sigilBtn.addEventListener("click", openInvitation);


musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => musicToggle.classList.add("is-playing")).catch(() => {});
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("is-playing");
  }
});


const cdDays = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMins = document.getElementById("cd-mins");
const cdSecs = document.getElementById("cd-secs");

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
  const now = new Date();
  let diff = FECHA_EVENTO - now;

  if (diff <= 0) {
    cdDays.textContent = "00";
    cdHours.textContent = "00";
    cdMins.textContent = "00";
    cdSecs.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);

  cdDays.textContent = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent = pad(mins);
  cdSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);


const rsvpForm = document.getElementById("rsvpForm");
const rsvpSuccess = document.getElementById("rsvpSuccess");

rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = rsvpForm.querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  const formData = new FormData(rsvpForm);
  const data = Object.fromEntries(formData.entries());
  data._subject = `Nueva confirmación de asistencia — Cumpleaños de Liliam y Mario`;

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${CORREO_DESTINO}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Fallo el envío");

    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar confirmación";
    alert("No se pudo enviar la confirmación. Por favor intenta de nuevo en unos segundos.");
  }
});


function populateImages() {
  const hero = document.getElementById("heroImg");
  if (hero) hero.src = HERO_IMAGE;

  const galleryImages = typeof GALLERY_IMAGES !== "undefined" ? GALLERY_IMAGES : [];
  galleryImages.forEach((path, i) => {
    const el = document.getElementById(`gallery${i + 1}`);
    if (el) el.src = path;
  });
}

document.addEventListener("DOMContentLoaded", populateImages);


function getSpanishDayName(date) {
  return date.toLocaleDateString('es-ES', { weekday: 'long' }).replace(/^./, s => s.toUpperCase());
}

function formatDatePill(date) {
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
  return `${day} ${month}`;
}

function formatTimePill(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}h`;
}

function updateHoraTexto() {
  const horaTexto = document.getElementById('horaTexto');
  const pillTime = document.getElementById('pill-time');
  const texto = HORA_DEFINIDA ? formatTimePill(FECHA_EVENTO) : "6:00 PM";
  if (horaTexto) horaTexto.textContent = texto;
  if (pillTime) pillTime.textContent = texto;
}

function renderMiniCalendar() {
  const container = document.getElementById('miniCalendar');
  if (!container) return;

  const eventDate = new Date(FECHA_EVENTO);
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();

  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0=Dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  container.innerHTML = '';
  const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  const wk = document.createElement('div'); wk.className = 'weekdays';
  weekdays.forEach(d => { const el = document.createElement('div'); el.textContent = d; wk.appendChild(el); });
  container.appendChild(wk);

  const daysGrid = document.createElement('div'); daysGrid.className = 'days';

  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement('div'); empty.className = 'day disabled'; empty.textContent = '';
    daysGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'day';
    cell.textContent = d;

    if (d === eventDate.getDate()) cell.classList.add('selected');

    const today = new Date();
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      cell.classList.add('today');
    }
    daysGrid.appendChild(cell);
  }

  container.appendChild(daysGrid);

  const pillDay = document.getElementById('pill-day');
  const pillDate = document.getElementById('pill-date');
  if (pillDay) pillDay.textContent = getSpanishDayName(eventDate);
  if (pillDate) pillDate.textContent = formatDatePill(eventDate);
  updateHoraTexto();
}

document.addEventListener('DOMContentLoaded', () => {
  populateImages();
  renderMiniCalendar();
});
