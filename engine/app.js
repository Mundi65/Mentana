// =========================================================================
// MOTOR: arranque de la app.
// Carga la configuración (Capa C) y el tema, y por ahora solo confirma
// que todo está enlazado mostrando el nombre de la marca.
// Más adelante (Paso 2+) aquí se decide si mostrar onboarding o Home.
// =========================================================================

import appConfig from '../config/app.config.js';
import router from './router.js';
import welcome from './screens/welcome.js';
import survey from './screens/survey.js';
import summary from './screens/summary.js';
import paywall from './screens/paywall.js';
import home from './screens/home.js';
import gameIntro from './screens/gameIntro.js';
import gamePlay from './screens/gamePlay.js';
import gameResult from './screens/gameResult.js';
import progress from './screens/progress.js';
import achievements from './screens/achievements.js';
import streakScreen from './screens/streakScreen.js';
import library from './screens/library.js';
import testIntro from './screens/testIntro.js';
import testPlay from './screens/testPlay.js';
import testResult from './screens/testResult.js';
import onboarding from './onboarding.js';

function registrarPantallas() {
  router.registrar('welcome', welcome);
  router.registrar('survey', survey);
  router.registrar('summary', summary);
  router.registrar('paywall', paywall);
  router.registrar('home', home);
  router.registrar('gameIntro', gameIntro);
  router.registrar('gamePlay', gamePlay);
  router.registrar('gameResult', gameResult);
  router.registrar('progress', progress);
  router.registrar('achievements', achievements);
  router.registrar('streakScreen', streakScreen);
  router.registrar('library', library);
  router.registrar('testIntro', testIntro);
  router.registrar('testPlay', testPlay);
  router.registrar('testResult', testResult);
}

function aplicarTema() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = appConfig.tema;
  document.head.appendChild(link);
}

function registrarServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }
}

function iniciar() {
  aplicarTema();
  registrarPantallas();
  registrarServiceWorker();
  onboarding.arrancar();
}

iniciar();
