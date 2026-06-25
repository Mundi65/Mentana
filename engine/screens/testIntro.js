// Pantalla: testIntro — presenta un test antes de empezarlo.

import { cargarTest } from '../tests.js';
import router from '../router.js';
import { montarBotonAtras } from '../botonAtras.js';

export default {
  async render(container, { testId }, token) {
    container.innerHTML = `<div class="pantalla" style="align-items:center; justify-content:center;"><p style="color: var(--color-texto-tenue);">Cargando…</p></div>`;

    const test = await cargarTest(testId);
    if (!router.esVigente(token)) return;

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="tarjeta" style="text-align:center; max-width:340px; width:100%;">
          <div class="eyebrow">${test.tipo === 'cognitivo' ? 'Test cognitivo' : 'Test de personalidad'}</div>
          <div style="font-size:3.5rem; margin-top: var(--esp-3);">${test.icon}</div>
          <h1 class="display" style="font-size: var(--txt-xl); margin-top: var(--esp-2);">${test.name}</h1>
          <p style="color: var(--color-texto-tenue); margin-top: var(--esp-3);">${test.descripcion}</p>
          <p style="color: var(--color-texto-tenue); font-size: var(--txt-sm); margin-top: var(--esp-3);">${test.preguntas.length} preguntas · 2 minutos</p>
          <button id="btn-empezar-test" class="boton boton--filo" style="margin-top: var(--esp-6);">Empezar</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-empezar-test').addEventListener('click', () => {
      router.ir('testPlay', { testId });
    });

    montarBotonAtras(container);
  }
};
