// --- Efecto "matriz de codificación" en el hero ---
// Simula una cabeza de impresión de puntos (dot-matrix), como las que usan
// las impresoras de codificación industrial. Los puntos reaccionan al cursor
// como si fueran "tinta" activándose cerca del mouse.
(function () {
  const canvas = document.getElementById('matrix');
  const hero = document.getElementById('hero');
  const ctx = canvas.getContext('2d');

  let w, h, dpr, points = [];
  const spacing = 26;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
  }

  function buildGrid() {
    points = [];
    for (let y = spacing; y < h; y += spacing) {
      for (let x = spacing; x < w; x += spacing) {
        points.push({ x, y });
      }
    }
  }

  let mouse = { x: -9999, y: -9999 };
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const radius = 160;
    for (const p of points) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const closeness = Math.max(0, 1 - dist / radius);
      const size = 1.2 + closeness * 2.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      // Cerca del cursor: azul P-3005 C. Lejos: gris grafito muy suave sobre el blanco.
      ctx.fillStyle = closeness > 0.04
        ? `rgba(0,119,200,${0.3 + closeness * 0.6})`
        : 'rgba(55,58,54,0.10)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// --- Slideshow con puntos indicadores ("Por qué CodingBase") ---
(function initSlideshow() {
  const root = document.getElementById('slideshow');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const segments = Array.from(root.querySelectorAll('.progress-seg'));
  const DURATION = 7000; // ms por imagen, igual que la referencia
  let current = 0;
  let timer = null;

  function goTo(index) {
    clearTimeout(timer);
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    segments.forEach((seg, i) => seg.classList.toggle('is-active', i === current));
    timer = setTimeout(() => goTo(current + 1), DURATION);
  }

  segments.forEach((seg) => {
    seg.addEventListener('click', () => goTo(Number(seg.dataset.index)));
  });

  goTo(0);
})();

// --- Menú hamburguesa (mobile) ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Cierra el menú al elegir una opción
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// --- Carrusel infinito de clientes ---
// Edita este array con los nombres reales de tus clientes.
// Se duplica automáticamente para que el desplazamiento sea continuo (sin corte visible).
const clientes = [
  'Empresa Alfa', 'Industrias Beta', 'Grupo Gamma', 'Delta Alimentos',
  'Manufactura Épsilon', 'Zeta Envases', 'Eta Logística', 'Theta Bebidas'
];

(function buildMarquee() {
  const track = document.getElementById('marquee-track');
  const itemsHTML = clientes
    .map(nombre => `<span class="marquee-item">${nombre}</span><span class="marquee-sep">◆</span>`)
    .join('');
  // Se inserta dos veces seguidas: la animación mueve el track exactamente 50%,
  // dando la sensación de un loop infinito sin salto.
  track.innerHTML = itemsHTML + itemsHTML;
})();

// --- Botón flotante "volver arriba" ---
const topBtn = document.getElementById('top-btn');
window.addEventListener('scroll', () => {
  topBtn.classList.toggle('visible', window.scrollY > 400);
});
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Formulario de contacto ---
// Por ahora solo valida y muestra confirmación en pantalla.
// Para guardar los datos en PostgreSQL necesitas un backend (por ejemplo
// Node.js + Express) que reciba este POST y escriba en la base de datos:
// el navegador nunca debe conectarse directo a PostgreSQL.
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const note = document.getElementById('form-note');

  // Ejemplo de cómo se enviaría a un backend propio:
  // fetch('/api/contacto', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(Object.fromEntries(new FormData(this)))
  // });

  note.textContent = 'Mensaje recibido. Te contactaremos a la brevedad.';
  this.reset();
});