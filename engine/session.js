// =========================================================================
// MOTOR: session.js — arma y avanza la sesión diaria de juegos.
// La sesión es una lista de N ids de juego (N = config.sesion.juegosPorSesion),
// elegidos de juegosActivos. Se guarda en el store para que sobreviva si
// recargas la página a mitad de sesión.
// =========================================================================

import store from './store.js';
import appConfig from '../config/app.config.js';

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function armarNuevaSesion() {
  const activos = appConfig.juegosActivos;
  const cantidad = appConfig.sesion.juegosPorSesion;
  const juegosId = [];
  for (let i = 0; i < cantidad; i++) {
    juegosId.push(activos[i % activos.length]);
  }
  return { fecha: hoyISO(), juegosId, indiceActual: 0, completada: false };
}

// Devuelve la sesión de hoy, creándola si no existe o si es de un día anterior.
export function sesionDeHoy() {
  return store.actualizar((s) => {
    if (!s.sesionDiaria || s.sesionDiaria.fecha !== hoyISO()) {
      s.sesionDiaria = armarNuevaSesion();
    }
    return s;
  }).sesionDiaria;
}

// El id del juego que toca jugar ahora mismo en la sesión de hoy.
export function juegoActualDeSesion() {
  const s = sesionDeHoy();
  if (s.completada) return null;
  return s.juegosId[s.indiceActual];
}

// Avanza la sesión un juego. Si era el último, la marca completada y
// suma 1 a las sesiones completadas totales.
export function avanzarSesion() {
  return store.actualizar((s) => {
    s.sesionDiaria.indiceActual++;
    if (s.sesionDiaria.indiceActual >= s.sesionDiaria.juegosId.length) {
      s.sesionDiaria.completada = true;
      s.sesiones.completadas++;
    }
    return s;
  }).sesionDiaria;
}
