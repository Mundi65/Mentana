// Pantalla: gameIntro — instrucciones antes de jugar.
// Recibe { juegoId } por el router, carga el módulo del juego y muestra
// su nombre, ícono, instrucciones y habilidades que entrena.

import appConfig from '../../config/app.config.js';
import { cargarJuego } from '../games.js';
import router from '../router.js';

function nombreHabilidad(id) {
  const h = appConfig.habilidades.find(h => h.id === id);
  return h ? h.nombre : id;
}

export default {
  async render(container, { juegoId, modoLibre = false }) {
    container.innerHTML = `<div class="pantalla" style="align-items:center; justify-content:center;"><p style="color: var(--color-texto-tenue);">${appConfig.textos.cargando}</p></div>`;

    const juego = await cargarJuego(juegoId);
    const chipsHabilidades = juego.skills.map(id => `<span class="cat-chip cat-${juego.category}">${nombreHabilidad(id)}</span>`).join(' ');
    const pasos = juego.comoJugar || [];
    const pasosHTML = pasos.length > 0
      ? `<ol style="text-align:left; color: var(--color-texto-tenue); margin-top: var(--esp-4); padding-left: var(--esp-5); line-height:1.6;">
          ${pasos.map(p => `<li style="margin-bottom: var(--esp-2);">${p}</li>`).join('')}
         </ol>`
      : '';

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="tarjeta" style="text-align:center; max-width:340px; width:100%;">
          <div class="eyebrow">${appConfig.categorias.find(c => c.id === juego.category)?.nombre || juego.category}</div>
          <div style="font-size:3.5rem; margin-top: var(--esp-3);">${juego.icon}</div>
          <h1 class="display" style="font-size: var(--txt-xl); margin-top: var(--esp-2);">${juego.name}</h1>
          <p style="color: var(--color-texto-tenue); margin-top: var(--esp-3);">${juego.instructions}</p>
          ${pasosHTML}
          <div style="display:flex; gap: var(--esp-2); justify-content:center; flex-wrap:wrap; margin-top: var(--esp-4);">${chipsHabilidades}</div>
          <button id="btn-jugar" class="boton boton--filo" style="margin-top: var(--esp-6);">Jugar</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-jugar').addEventListener('click', () => {
      router.ir('gamePlay', { juegoId, modoLibre });
    });
  }
};
