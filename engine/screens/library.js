// Pantalla: library — menú con TODOS los juegos y tests disponibles,
// agrupados por sección. Permite jugar/hacer un test suelto, fuera del
// orden de la sesión diaria (modoLibre).

import appConfig from '../../config/app.config.js';
import { cargarJuego } from '../games.js';
import { cargarTest } from '../tests.js';
import router from '../router.js';

export default {
  async render(container) {
    container.innerHTML = `<div class="pantalla" style="align-items:center; justify-content:center;"><p style="color: var(--color-texto-tenue);">${appConfig.textos.cargando}</p></div>`;

    const juegos = await Promise.all(appConfig.juegosActivos.map(cargarJuego));
    const tests = await Promise.all((appConfig.testsActivos || []).map(cargarTest));

    const filaJuego = (j) => `
      <div class="fila-tarjeta" data-tipo="juego" data-id="${j.id}">
        <div class="fila-icono">${j.icon}</div>
        <div>
          <div style="font-weight:700;">${j.name}</div>
          <span class="cat-chip cat-${j.category}">${appConfig.categorias.find(c => c.id === j.category)?.nombre || j.category}</span>
        </div>
        <div class="fila-flecha">›</div>
      </div>
    `;

    const filaTest = (t) => `
      <div class="fila-tarjeta" data-tipo="test" data-id="${t.id}">
        <div class="fila-icono">${t.icon}</div>
        <div>
          <div style="font-weight:700;">${t.name}</div>
          <span style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">${t.tipo === 'cognitivo' ? 'Test cognitivo' : 'Test de personalidad'}</span>
        </div>
        <div class="fila-flecha">›</div>
      </div>
    `;

    container.innerHTML = `
      <div class="pantalla" style="max-width:480px; margin:auto;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">Biblioteca</h1>

        <div class="eyebrow" style="margin-bottom: var(--esp-3);">Juegos (${juegos.length})</div>
        ${juegos.map(filaJuego).join('')}

        <div class="eyebrow" style="margin-top: var(--esp-5); margin-bottom: var(--esp-3);">Tests (${tests.length})</div>
        ${tests.length > 0 ? tests.map(filaTest).join('') : `<p style="color: var(--color-texto-tenue);">Pronto agregaremos más tests.</p>`}

        <button id="btn-volver" class="boton boton--fantasma" style="margin-top: var(--esp-6);">Volver a Home</button>
      </div>
    `;

    container.querySelectorAll('.fila-tarjeta').forEach((fila) => {
      fila.addEventListener('click', () => {
        const { tipo, id } = fila.dataset;
        if (tipo === 'juego') {
          router.ir('gameIntro', { juegoId: id, modoLibre: true });
        } else {
          router.ir('testIntro', { testId: id });
        }
      });
    });

    container.querySelector('#btn-volver').addEventListener('click', () => router.ir('home'));
  }
};
