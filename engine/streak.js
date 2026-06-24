// =========================================================================
// MOTOR: streak.js — racha de días entrenando.
// Regla: si entrenas hoy y ya habías entrenado ayer, la racha sube.
// Si entrenas hoy y el último día fue hoy mismo, no cambia (ya contaba).
// Si pasó más de un día sin entrenar, la racha se reinicia a 1 (hoy).
// =========================================================================

import store from './store.js';

// Devuelve la fecha de hoy como 'YYYY-MM-DD' (solo el día, sin hora).
function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function diasEntre(fechaISOa, fechaISOb) {
  const a = new Date(fechaISOa + 'T00:00:00');
  const b = new Date(fechaISOb + 'T00:00:00');
  const msPorDia = 24 * 60 * 60 * 1000;
  return Math.round((b - a) / msPorDia);
}

// Se llama cuando el jugador completa la sesión diaria (todos los juegos del día).
// Actualiza la racha en el store y devuelve el nuevo estado de racha.
export function registrarEntrenamientoDeHoy() {
  const hoy = hoyISO();

  return store.actualizar((s) => {
    const ultimo = s.racha.ultimoDiaEntrenado;

    if (ultimo === hoy) {
      // Ya se había registrado hoy: no hacer nada.
      return s;
    }

    if (ultimo) {
      const diferencia = diasEntre(ultimo, hoy);
      if (diferencia === 1) {
        s.racha.actual += 1; // entrenó ayer y hoy: la racha sigue.
      } else {
        s.racha.actual = 1; // se perdió al menos un día: la racha se reinicia.
      }
    } else {
      s.racha.actual = 1; // primera vez que entrena.
    }

    s.racha.ultimoDiaEntrenado = hoy;
    s.racha.mejor = Math.max(s.racha.mejor, s.racha.actual);
    return s;
  }).racha;
}

// Calcula si la racha sigue viva (para mostrarla en Home sin esperar a entrenar).
// Si el último entrenamiento fue hoy o ayer, la racha sigue activa.
// Si fue hace 2 días o más, ya se rompió (aunque el número guardado no se haya
// puesto a 0 todavía: se pondrá a 0 la próxima vez que se registre algo).
export function rachaEstaActiva() {
  const { ultimoDiaEntrenado } = store.obtener().racha;
  if (!ultimoDiaEntrenado) return false;
  const diferencia = diasEntre(ultimoDiaEntrenado, hoyISO());
  return diferencia <= 1;
}

export function obtenerRacha() {
  return store.obtener().racha;
}
