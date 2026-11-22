// Entradas suaves al hacer scroll: cada bloque sube y aparece la primera vez que se ve.
// Sin JavaScript (o con movimiento reducido) todo se ve desde el principio.
(function () {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('.texto h2, .texto h3, .texto p, .texto li, [data-entra], .tema h2, .tema h3, .tema p, .tema .pantalla, .preguntas > div, .preguntas > h2, .pie .nombre');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sibs = Array.prototype.indexOf.call(e.target.parentNode.children, e.target);
        e.target.style.setProperty('--retraso', (Math.min(sibs, 4) * 70) + 'ms');
        e.target.classList.add('visto');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { el.classList.add('entra'); io.observe(el); });
  });
})();
