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
      // Cerca del cursor: celeste P-2995 C. Lejos: gris neutro sobre el grafito.
      ctx.fillStyle = closeness > 0.04
        ? `rgba(0,169,224,${0.25 + closeness * 0.7})`
        : 'rgba(167,171,165,0.16)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// --- Carrusel infinito de clientes ---
// Edita este array con los nombres reales de tus clientes.
// Se duplica automáticamente para que el desplazamiento sea continuo (sin corte visible).
const clientes = [
  'Empresa MATI', 'Industrias CARO', 'Grupo DOMI', 'SHIFU Alimentos',
  'GATITOS Épsilon', 'Zeta Envases', 'NEITH FOREVER', 'Theta Bebidas'
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