// Español o inglés: ?lang=en|es; si no, el idioma del navegador
// (español también para catalán, gallego y euskera, como en la app).
(function () {
  var p = new URLSearchParams(location.search).get('lang');
  var nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
  var i = p === 'en' || p === 'es' ? p : ['es', 'ca', 'gl', 'eu'].indexOf(nav) >= 0 ? 'es' : 'en';
  document.documentElement.setAttribute('data-idioma', i);
  document.documentElement.lang = i;
  document.addEventListener('DOMContentLoaded', function () {
    // Los enlaces internos conservan el idioma elegido.
    if (p) document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (a.hasAttribute('data-lang') || /^(https?:|mailto:|#|\?)/.test(h)) return;
      a.setAttribute('href', h + (h.indexOf('?') < 0 ? '?' : '&') + 'lang=' + p);
    });
    document.querySelectorAll('[data-lang]').forEach(function (a) {
      if (a.getAttribute('data-lang') === i) a.setAttribute('aria-current', 'true');
    });
  });
})();
