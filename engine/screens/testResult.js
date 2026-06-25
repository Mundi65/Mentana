// Pantalla: testResult — muestra el perfil ganador del test.

import { cargarTest, calcularPerfilGanador } from '../tests.js';
import router from '../router.js';
import { montarBotonAtras } from '../botonAtras.js';

export default {
  async render(container, { testId, clavesElegidas }, token) {
    const test = await cargarTest(testId);
    if (!router.esVigente(token)) return;
    const perfil = calcularPerfilGanador(test, clavesElegidas);

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="tarjeta" style="text-align:center; max-width:340px; width:100%;">
          <div class="eyebrow">${test.name}</div>
          <div style="font-size:3.5rem; margin-top: var(--esp-3);">${test.icon}</div>
          <h1 class="display" style="font-size: var(--txt-xl); margin-top: var(--esp-2); color: var(--color-filo);">${perfil.nombre}</h1>
          <p style="color: var(--color-texto-tenue); margin-top: var(--esp-3);">${perfil.descripcion}</p>
          <button id="btn-volver-test" class="boton boton--filo" style="margin-top: var(--esp-6);">Volver</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-volver-test').addEventListener('click', () => {
      router.ir('tests', {}, { reemplazar: true });
    });

    montarBotonAtras(container);
  }
};
