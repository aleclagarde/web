// pasati/ — lo que se mueve en la portada de Pasati. Sin este fichero la
// página se lee entera igual: solo se pierde la fecha de hoy, las pestañas
// y el selector de juegos (que enseñan el primero de cada).
(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    // La fecha de hoy en la cabecera, como en la app.
    document.querySelectorAll('[data-fecha]').forEach(function (el) {
      var l = el.getAttribute('data-fecha') === 'en' ? 'en-GB' : 'es-ES';
      var t = new Date().toLocaleDateString(l, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      el.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    });

    // Pestañas de «Tres formas de jugar».
    document.querySelectorAll('[data-modos]').forEach(function (caja) {
      var tabs = caja.querySelectorAll('[role="tab"]');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var i = tab.getAttribute('data-modo');
          tabs.forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
          caja.querySelectorAll('img[data-modo], .modo[data-modo]').forEach(function (el) {
            el.hidden = el.getAttribute('data-modo') !== i;
          });
        });
      });
    });

    // Selector de juegos: su pantalla y sus reglas.
    document.querySelectorAll('[data-juegos]').forEach(function (caja) {
      var img = caja.querySelector('[data-img]');
      var nombre = caja.querySelector('[data-nombre]');
      var regla = caja.querySelector('[data-regla]');
      var lengua = img.getAttribute('data-lang-img');
      caja.querySelectorAll('button[data-k]').forEach(function (b) {
        b.addEventListener('click', function () {
          caja.querySelectorAll('button[data-k]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          img.src = 'img/' + b.getAttribute('data-k') + '-' + lengua + '.jpg';
          img.alt = b.getAttribute('data-n');
          nombre.textContent = b.getAttribute('data-n');
          regla.textContent = b.getAttribute('data-r');
          img.classList.remove('cambia'); void img.offsetWidth; img.classList.add('cambia');
          if (window.matchMedia('(max-width: 900px)').matches) img.closest('.juegos-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    });

    // El diálogo de «Grupo nuevo»: se puede escribir y elegir idioma.
    document.querySelectorAll('.segmentos').forEach(function (g) {
      var bs = g.querySelectorAll('button');
      bs.forEach(function (b) {
        b.addEventListener('click', function () { bs.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); }); });
      });
    });

    // Entradas: cada pieza aparece al llegar a ella (una vez).
    document.querySelectorAll('.tique li, .hojita > *, .juegos-lista li, .modos-texto > *, .cierre-texto > *, .dialogo, .pie-columnas > div, .juego-info').forEach(function (el) { el.classList.add('aparece'); });
    var piezas = document.querySelectorAll('.aparece');
    if (!('IntersectionObserver' in window)) { piezas.forEach(function (p) { p.classList.add('visto'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    piezas.forEach(function (p, i) {
      var hermanos = p.parentElement ? Array.prototype.indexOf.call(p.parentElement.querySelectorAll(':scope > .aparece'), p) : 0;
      p.style.setProperty('--retraso', Math.max(0, hermanos) * 80 + 'ms');
      io.observe(p);
    });
  });
})();
