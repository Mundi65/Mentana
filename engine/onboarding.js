// =========================================================================
// MOTOR: onboarding.js — máquina de estados del primer arranque.
// Orden fijo: welcome -> survey -> summary -> paywall -> home.
// Cada pantalla, al terminar su parte, llama a la función "siguiente" de
// aquí en vez de llamar al router directamente. Así el ORDEN del onboarding
// vive en un solo lugar.
// =========================================================================

import router from './router.js';
import store from './store.js';

// Días transcurridos entre una fecha 'YYYY-MM-DD' y hoy.
function diasDesde(fechaISO) {
  const a = new Date(fechaISO + 'T00:00:00');
  const b = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

// Control de acceso: suscrito -> entra; en prueba con días -> entra;
// prueba vencida sin suscripción -> NO entra (muro de pago).
export function tieneAcceso(estado) {
  if (estado.suscripcion.activa) return true;
  if (estado.prueba.inicio) {
    return diasDesde(estado.prueba.inicio) < estado.prueba.diasTotales;
  }
  return false;
}

export const onboarding = {

  // Se llama al arrancar la app. Decide a dónde ir según el estado guardado.
  arrancar() {
    const estado = store.obtener();
    if (!estado.onboardingCompleto) {
      router.ir('welcome');
    } else if (tieneAcceso(estado)) {
      router.ir('home');
    } else {
      router.ir('paywall'); // prueba vencida sin suscripción: muro de pago.
    }
  },

  // Pasos del onboarding, en orden. Cada pantalla llama a la siguiente función
  // cuando el usuario completa su parte (no navega directo con el router).
  irASurvey() {
    router.ir('survey');
  },

  irASummary() {
    router.ir('summary');
  },

  irAPaywall() {
    router.ir('paywall');
  }
};

export default onboarding;
