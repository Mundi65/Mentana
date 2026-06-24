// Pantalla: juegos — lista de TODOS los juegos disponibles (pestaña "Juegos").

import appConfig from '../../config/app.config.js';
import { cargarJuego } from '../games.js';
import router from '../router.js';
import { montarNav, ALTO_NAV } from '../navInferior.js';

export default {
  async render(container) {
    container.innerHTML = `<div class="pantalla" style="align-items:center; justify-content:center;"><p style="color: var(--color-texto-tenue);">${appConfig.textos.cargando}</p></div>`;

    const juegos = await Promise.all(appConfig.juegosActivos.map(cargarJuego));

    const filaJuego = (j) => `
      <div class="fila-tarjeta" data-id="${j.id}">
        <div class="fila-icono">${j.icon}</div>
        <div>
          <div style="font-weight:700;">${j.name}</div>
          <span class="cat-chip cat-${j.category}">${appConfig.categorias.find(c => c.id === j.category)?.nombre || j.category}</span>
        </div>
        <div class="fila-flecha">›</div>
      </div>
    `;

    container.innerHTML = `
      <div class="pantalla" style="max-width:480px; margin:auto; padding-bottom:${ALTO_NAV}px;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">Juegos</h1>
        ${juegos.map(filaJuego).join('')}
      </div>
    `;

    container.querySelectorAll('.fila-tarjeta').forEach((fila) => {
      fila.addEventListener('click', () => {
        router.ir('gameIntro', { juegoId: fila.dataset.id, modoLibre: true });
      });
    });

    montarNav(container, 'juegos');
  }
};
