// A qué tienda manda /sobremesa/descargar/.
(function () {
  var APP_STORE = 'https://apps.apple.com/app/id6837950280';
  var GOOGLE_PLAY = null; // 'https://play.google.com/store/apps/details?id=com.aleclagarde.sobremesa'
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  if (ios) location.replace(APP_STORE);
  else if (android && GOOGLE_PLAY) location.replace(GOOGLE_PLAY);
})();
