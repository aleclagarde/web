// Botones de la App Store fuera del iPhone. Las apps solo están para iPhone:
// en el ordenador o en Android, en vez de mandar a una ficha que no se puede
// instalar, se abre un aviso con un código QR para escanear con el iPhone y,
// para Android, cómo pedir acceso a la prueba.
(function () {
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) return;
  var android = /Android/.test(ua);

  var APPS = {
    pasati: { nombre: 'Pasati', correo: 'pasati@aleclagarde.com',
      asunto: { es: 'Quiero probar Pasati en Android', en: 'I want to try Pasati on Android' } },
    ster: { nombre: 'Ster', correo: 'ster@aleclagarde.com',
      asunto: { es: 'Acceso a Ster en Android', en: 'Ster on Android' } }
  };
  var TX = {
    es: {
      titulo: function (n) { return n + ' es para iPhone'; },
      qr: 'Escanea el código con la cámara del iPhone y se abrirá en la App Store.',
      android: 'En Android aún está en pruebas: escríbenos con el correo de tu cuenta de Google y te damos acceso.',
      pedir: 'Pedir acceso para Android', ver: 'Ver la ficha en la App Store', cerrar: 'Cerrar',
      alt: 'Código QR de la App Store'
    },
    en: {
      titulo: function (n) { return n + ' is for iPhone'; },
      qr: 'Scan the code with your iPhone camera and it will open in the App Store.',
      android: 'On Android it is still in testing: email us your Google account address and we’ll give you access.',
      pedir: 'Request Android access', ver: 'See it on the App Store', cerrar: 'Close',
      alt: 'App Store QR code'
    }
  };

  function crear(tag, clase, texto) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto) e.textContent = texto;
    return e;
  }

  function abrir(enlace) {
    var app = /\/ster\//.test(location.pathname) ? 'ster' : 'pasati';
    var A = APPS[app];
    var L = document.documentElement.lang === 'en' ? 'en' : 'es';
    var t = TX[L];
    var raiz = /\/(pasati|ster)\//.exec(location.pathname);
    var base = raiz ? location.pathname.slice(0, raiz.index + raiz[0].length) : '/' + app + '/';

    var d = crear('dialog', 'tienda');
    d.setAttribute('aria-label', t.titulo(A.nombre));
    var cerrar = crear('button', 'tienda-cerrar', '×');
    cerrar.type = 'button';
    cerrar.setAttribute('aria-label', t.cerrar);
    cerrar.addEventListener('click', function () { d.close(); });
    d.appendChild(cerrar);
    d.appendChild(crear('p', 'tienda-titulo', t.titulo(A.nombre)));
    if (!android) {
      var img = crear('img', 'tienda-qr');
      img.src = base + 'qr-app-store.svg';
      img.alt = t.alt;
      img.width = 200; img.height = 200;
      d.appendChild(img);
      d.appendChild(crear('p', 'tienda-texto', t.qr));
    }
    d.appendChild(crear('p', 'tienda-texto', t.android));
    var pedir = crear('a', 'tienda-boton', t.pedir);
    pedir.href = 'mailto:' + A.correo + '?subject=' + encodeURIComponent(A.asunto[L]);
    d.appendChild(pedir);
    var ver = crear('a', 'tienda-enlace', t.ver);
    ver.href = enlace.href;
    d.appendChild(ver);

    d.addEventListener('close', function () { d.remove(); enlace.focus(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    document.body.appendChild(d);
    d.showModal();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://apps.apple.com/"]');
    if (!a || a.classList.contains('tienda-enlace') || typeof HTMLDialogElement !== 'function') return;
    e.preventDefault();
    abrir(a);
  });
})();
