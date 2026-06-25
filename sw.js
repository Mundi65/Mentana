// Service Worker de MENTANA — instalable y funciona offline.
// Cachea el "esqueleto" de la app (todo lo necesario para que abra sin
// internet) y se actualiza solo cuando sube la versión de CACHE_NOMBRE.

const CACHE_NOMBRE = 'mentana-v9';

const ARCHIVOS_ESENCIALES = [
  './',
  './index.html',
  './manifest.json',
  './themes/mentana.css',
  './config/app.config.js',
  './icons/icon.svg',
  './engine/app.js',
  './engine/store.js',
  './engine/router.js',
  './engine/onboarding.js',
  './engine/payments.js',
  './engine/session.js',
  './engine/games.js',
  './engine/gameRunner.js',
  './engine/scoring.js',
  './engine/streak.js',
  './engine/achievements.js',
  './engine/screens/welcome.js',
  './engine/screens/survey.js',
  './engine/screens/summary.js',
  './engine/screens/paywall.js',
  './engine/screens/home.js',
  './engine/screens/gameIntro.js',
  './engine/screens/gamePlay.js',
  './engine/screens/gameResult.js',
  './engine/screens/progress.js',
  './engine/screens/achievements.js',
  './engine/screens/streakScreen.js',
  './engine/screens/modals.js',
  './engine/screens/juegos.js',
  './engine/screens/testsMenu.js',
  './engine/screens/perfil.js',
  './engine/screens/testIntro.js',
  './engine/screens/testPlay.js',
  './engine/screens/testResult.js',
  './engine/navInferior.js',
  './engine/botonAtras.js',
  './engine/tests.js',
  './games/_iconos.js',
  './games/centinela.js',
  './games/eco-patrones.js',
  './games/capas-recuerdo.js',
  './games/filtro.js',
  './games/balanza-mental.js',
  './games/engranajes.js',
  './games/sopa-de-letras.js',
  './games/clasificar-colores.js',
  './games/conecta-tuberias.js',
  './games/un-trazo.js',
  './tests/estilo-memoria.js',
  './tests/tipo-pensador.js'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOMBRE)
      .then((cache) => cache.addAll(ARCHIVOS_ESENCIALES))
      .then(() => self.skipWaiting()) // no esperar a que se cierren todas las pestañas: activarse ya.
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nombres) =>
        Promise.all(nombres.filter((n) => n !== CACHE_NOMBRE).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim()) // tomar control de las pestañas ya abiertas, sin esperar a que recarguen.
  );
});

// Estrategia: primero caché (rápido y funciona offline), si no está, va a red
// y guarda la copia nueva para la próxima vez.
self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((enCache) => {
      if (enCache) return enCache;
      return fetch(evento.request).then((respuestaRed) => {
        const copia = respuestaRed.clone();
        caches.open(CACHE_NOMBRE).then((cache) => cache.put(evento.request, copia));
        return respuestaRed;
      }).catch(() => enCache);
    })
  );
});
