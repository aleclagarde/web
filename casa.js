// Inicio y apps: aparición al bajar y la hora de Barcelona.
(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    var piezas = document.querySelectorAll('.ficha, .bloque > h2, .libro > li, .habilidades > div, .bloque-apps > div > *, .cierre, .tarjeta, .tesela');
    if ('IntersectionObserver' in window) {
      var vis = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visto'); vis.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      piezas.forEach(function (p, i) {
        p.classList.add('aparece');
        if (p.classList.contains('ficha')) p.style.transitionDelay = (i * 80) + 'ms';
        vis.observe(p);
      });
    }

    var relojes = document.querySelectorAll('[data-reloj]');
    function hora() {
      var t;
      try {
        t = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' }).format(new Date());
      } catch (e) { t = ''; }
      relojes.forEach(function (r) { r.textContent = t; });
    }
    if (relojes.length) { hora(); setInterval(hora, 15000); }
  });
})();
