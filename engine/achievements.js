// =========================================================================
// MOTOR: achievements.js — evalúa y desbloquea logros.
// Los logros se definen en /config/app.config.js (id, condición). Este
// archivo solo sabe revisar condiciones genéricas contra el store; no conoce
// los logros concretos de ninguna app.
// =========================================================================

import store from './store.js';
import appConfig from '../config/app.config.js';

// Revisa una condición de logro contra el estado actual + contexto del momento
// (ej. la precisión del juego que se acaba de terminar).
function cumpleCondicion(condicion, estado, contexto) {
  switch (condicion.tipo) {
    case 'sesionesCompletadas':
      return estado.sesiones.completadas >= condicion.valor;
    case 'racha':
      return estado.racha.actual >= condicion.valor;
    case 'precisionJuego':
      return contexto.precisionJuego != null && contexto.precisionJuego >= condicion.valor;
    default:
      return false;
  }
}

// Revisa TODOS los logros pendientes y desbloquea los que ya se cumplen.
// contexto: datos del momento que no viven en el store permanente,
// ej. { precisionJuego: 100 } justo al terminar una partida.
// Devuelve la lista de logros NUEVOS desbloqueados en esta llamada.
export function evaluarLogros(contexto = {}) {
  const nuevos = [];

  store.actualizar((s) => {
    for (const logro of appConfig.logros) {
      if (s.logrosDesbloqueados.includes(logro.id)) continue;
      if (cumpleCondicion(logro.condicion, s, contexto)) {
        s.logrosDesbloqueados.push(logro.id);
        nuevos.push(logro);
      }
    }
    return s;
  });

  return nuevos;
}

export function logrosDesbloqueados() {
  const ids = store.obtener().logrosDesbloqueados;
  return appConfig.logros.filter(l => ids.includes(l.id));
}

export function logrosPendientes() {
  const ids = store.obtener().logrosDesbloqueados;
  return appConfig.logros.filter(l => !ids.includes(l.id));
}
