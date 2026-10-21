// Inicio y apps: el escenario cambia según la sección que se lee o la app que
// se señala, aparición al bajar y la hora de Barcelona en el pie.
(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.casa').forEach(function (casa) {
      var escenas = casa.querySelectorAll('.escena');
      var actual = escenas[0] && escenas[0].getAttribute('data-escena');
      var fijada = null;
      function muestra(k) {
        if (!k || k === actual) return;
        actual = k;
        escenas.forEach(function (e) { e.classList.toggle('activa', e.getAttribute('data-escena') === k); });
      }
      var porSeccion = actual;

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              porSeccion = e.target.getAttribute('data-escena');
              if (!fijada) muestra(porSeccion);
            }
          });
        }, { rootMargin: '-45% 0px -45% 0px' });
        casa.querySelectorAll('.columna > section[data-escena]').forEach(function (s) { io.observe(s); });
      }

      // Índice de apps: señalar una fila trae sus pantallas.
      casa.querySelectorAll('[data-ver]').forEach(function (a) {
        function entra() {
          fijada = a.getAttribute('data-ver');
          casa.querySelectorAll('[data-ver]').forEach(function (o) { o.classList.toggle('vista', o === a); });
          muestra(fijada);
        }
        function sale() {
          fijada = null;
          a.classList.remove('vista');
          muestra(porSeccion);
        }
        a.addEventListener('mouseenter', entra);
        a.addEventListener('focus', entra);
        a.addEventListener('mouseleave', sale);
        a.addEventListener('blur', sale);
      });
    });

    // Aparición
    var piezas = document.querySelectorAll('.columna > section > *, .libro > li, .indice > li, .tesela');
    if ('IntersectionObserver' in window) {
      var vis = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visto'); vis.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      piezas.forEach(function (p) { p.classList.add('aparece'); vis.observe(p); });
    }

    // Hora de Barcelona
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
