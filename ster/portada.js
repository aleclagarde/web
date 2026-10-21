// Portada de Ster: aparición al bajar, pestañas del cielo y un cronómetro de
// prueba que, como la app, separa el tiempo efectivo de las pausas.
(function () {
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    // Aparición
    var piezas = document.querySelectorAll('.aparece');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      piezas.forEach(function (p) { io.observe(p); });
    } else {
      piezas.forEach(function (p) { p.classList.add('visto'); });
    }

    // Pestañas del cielo (Un mes / Todo)
    document.querySelectorAll('.cielo').forEach(function (s) {
      var botones = s.querySelectorAll('.pestanas button');
      botones.forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-vista');
          botones.forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
          s.querySelectorAll('.cielo-foto img').forEach(function (img) {
            img.hidden = img.getAttribute('data-vista') !== v;
          });
        });
      });
    });

    // Cronómetro
    var relojes = [];
    document.querySelectorAll('[data-crono]').forEach(function (c) {
      var r = { c: c, estado: 'parado', efectivo: 0, pausa: 0, pausas: 0, desde: 0, auto: false };
      var boton = c.querySelector('[data-boton]');
      r.pinta = function () {
        var ahora = Date.now();
        var ef = r.efectivo + (r.estado === 'corre' ? ahora - r.desde : 0);
        var pa = r.pausa + (r.estado === 'pausa' ? ahora - r.desde : 0);
        c.querySelector('[data-tiempo]').textContent = hms(ef);
        c.querySelector('[data-efectivo]').textContent = corto(ef);
        c.querySelector('[data-pausa]').textContent = corto(pa);
        c.querySelector('[data-pausas]').textContent = r.pausas;
        c.setAttribute('data-estado', r.estado);
        boton.textContent = boton.getAttribute(r.estado === 'corre' ? 'data-pausar' : r.estado === 'pausa' ? 'data-seguir' : 'data-empezar');
      };
      r.cambia = function (nuevo) {
        var ahora = Date.now();
        if (r.estado === 'corre') r.efectivo += ahora - r.desde;
        if (r.estado === 'pausa') r.pausa += ahora - r.desde;
        if (nuevo === 'pausa') r.pausas++;
        r.estado = nuevo; r.desde = ahora; r.pinta();
      };
      boton.addEventListener('click', function () {
        r.auto = false;
        r.cambia(r.estado === 'corre' ? 'pausa' : 'corre');
      });
      relojes.push(r);
    });
    if (relojes.length) {
      setInterval(function () {
        relojes.forEach(function (r) { if (r.estado !== 'parado') r.pinta(); });
      }, 250);
      // Cambiar de pestaña = bloquear el móvil: el tiempo pasa a ser pausa.
      document.addEventListener('visibilitychange', function () {
        relojes.forEach(function (r) {
          if (document.hidden && r.estado === 'corre') { r.cambia('pausa'); r.auto = true; }
          else if (!document.hidden && r.auto) { r.auto = false; r.cambia('corre'); }
        });
      });
    }
  });

  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function hms(ms) {
    var s = Math.floor(ms / 1000);
    return dos(Math.floor(s / 3600)) + ':' + dos(Math.floor(s / 60) % 60) + ':' + dos(s % 60);
  }
  function corto(ms) {
    var s = Math.floor(ms / 1000);
    return s < 60 ? s + ' s' : Math.floor(s / 60) + ' min';
  }
})();
