// Pantalla: gameResult — resultados de la partida.
// Recibe { juegoId, resultado, logrosNuevos } por el router. Al continuar,
// avanza la sesión: si era el último juego, registra la racha y va a Home;
// si no, pasa a la intro del siguiente juego de la sesión.

import { cargarJuego } from '../games.js';
import router from '../router.js';
import { avanzarSesion } from '../session.js';
import { registrarEntrenamientoDeHoy } from '../streak.js';
import { evaluarLogros } from '../achievements.js';

export default {
  async render(container, { juegoId, resultado, logrosNuevos = [] }) {
    const juego = await cargarJuego(juegoId);

    const logrosHTML = logrosNuevos.length > 0
      ? `<div class="tarjeta" style="margin-top: var(--esp-4); border-color: var(--color-filo);">
           <div class="eyebrow">¡Logro desbloqueado!</div>
           ${logrosNuevos.map(l => `<p style="margin-top: var(--esp-2);">${l.icono} <strong>${l.nombre}</strong> — ${l.descripcion}</p>`).join('')}
         </div>`
      : '';

    container.innerHTML = `
      <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding: var(--esp-5);">
        <div class="tarjeta" style="text-align:center; max-width:340px; width:100%;">
          <div class="eyebrow">${juego.name}</div>
          <div class="puntuacion-grande" style="margin-top: var(--esp-2);">${resultado.precision}%</div>
          <p style="color: var(--color-texto-tenue);">de precisión</p>

          <div style="display:flex; justify-content:space-around; margin-top: var(--esp-5);">
            <div>
              <div style="font-size: var(--txt-xl); font-weight:800; color: var(--color-exito);">${resultado.correctas}</div>
              <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">correctas</div>
            </div>
            <div>
              <div style="font-size: var(--txt-xl); font-weight:800; color: var(--color-error);">${resultado.incorrectas}</div>
              <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">incorrectas</div>
            </div>
            <div>
              <div style="font-size: var(--txt-xl); font-weight:800;">${resultado.puntuacion}</div>
              <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">puntos</div>
            </div>
          </div>

          ${resultado.subeNivel ? `<p style="color: var(--color-filo); margin-top: var(--esp-4); font-weight:700;">⬆️ ¡Subiste de nivel!</p>` : ''}
          ${logrosHTML}

          <button id="btn-continuar" class="boton boton--filo" style="margin-top: var(--esp-6);">Continuar</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-continuar').addEventListener('click', () => {
      const sesion = avanzarSesion();
      if (sesion.completada) {
        registrarEntrenamientoDeHoy();
        evaluarLogros(); // revisa logros que dependen de racha/sesiones (no del último juego).
        router.ir('home');
      } else {
        router.ir('gameIntro', { juegoId: sesion.juegosId[sesion.indiceActual] });
      }
    });
  }
};
