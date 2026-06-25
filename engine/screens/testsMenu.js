// Pantalla: testsMenu — lista de TODOS los tests disponibles (pestaña "Tests").

import appConfig from '../../config/app.config.js';
import { cargarTest } from '../tests.js';
import router from '../router.js';
import { montarNav, ALTO_NAV } from '../navInferior.js';
import { montarBotonAtras } from '../botonAtras.js';

export default {
  async render(container, params, token) {
    container.innerHTML = `<div class="pantalla" style="align-items:center; justify-content:center;"><p style="color: var(--color-texto-tenue);">${appConfig.textos.cargando}</p></div>`;

    const tests = await Promise.all((appConfig.testsActivos || []).map(cargarTest));
    if (!router.esVigente(token)) return;

    const filaTest = (t) => `
      <div class="fila-tarjeta" data-id="${t.id}">
        <div class="fila-icono">${t.icon}</div>
        <div>
          <div style="font-weight:700;">${t.name}</div>
          <span style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">${t.tipo === 'cognitivo' ? 'Test cognitivo' : 'Test de personalidad'}</span>
        </div>
        <div class="fila-flecha">›</div>
      </div>
    `;

    container.innerHTML = `
      <div class="pantalla" style="max-width:480px; margin:auto; padding-bottom:${ALTO_NAV}px;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">Tests</h1>
        ${tests.length > 0 ? tests.map(filaTest).join('') : `<p style="color: var(--color-texto-tenue);">Pronto agregaremos más tests.</p>`}
      </div>
    `;

    container.querySelectorAll('.fila-tarjeta').forEach((fila) => {
      fila.addEventListener('click', () => {
        router.ir('testIntro', { testId: fila.dataset.id });
      });
    });

    montarNav(container, 'tests');
    montarBotonAtras(container);
  }
};
