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
      ctx.fillStyle = closeness > 0.04
        ? `rgba(226,166,59,${0.25 + closeness * 0.7})`
        : 'rgba(139,146,160,0.18)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

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
