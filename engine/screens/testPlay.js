// Pantalla: testPlay — recorre las preguntas del test, una a la vez.
// A diferencia de la encuesta de onboarding, aquí cada opción tiene un
// "perfil" asociado (no se guarda en el store: el resultado es solo para
// que el usuario se conozca mejor).

import { cargarTest } from '../tests.js';
import router from '../router.js';

export default {
  async render(container, { testId }) {
    container.innerHTML = `<div class="pantalla" style="align-items:center; justify-content:center;"><p style="color: var(--color-texto-tenue);">Cargando…</p></div>`;

    const test = await cargarTest(testId);
    let indice = 0;
    const clavesElegidas = [];

    function dibujar() {
      const pregunta = test.preguntas[indice];
      const progreso = Math.round((indice / test.preguntas.length) * 100);

      const opcionesHTML = pregunta.opciones.map((op, i) => `
        <button class="tarjeta btn-opcion-test" data-perfil="${op.perfil}" style="display:block; width:100%; text-align:left; margin-bottom: var(--esp-2); cursor:pointer; padding: var(--esp-3) var(--esp-4); font: inherit; color: var(--color-texto); background:var(--color-superficie);">
          ${op.label}
        </button>
      `).join('');

      container.innerHTML = `
        <div class="pantalla" style="max-width:420px; margin:auto;">
          <div style="background: var(--color-superficie-2); border-radius: var(--radio-pastilla); height:6px; overflow:hidden; margin-bottom: var(--esp-5);">
            <div style="background: var(--color-primario); height:100%; width:${progreso}%; transition: width var(--trans-media);"></div>
          </div>
          <h2 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">${pregunta.texto}</h2>
          <div>${opcionesHTML}</div>
        </div>
      `;

      container.querySelectorAll('.btn-opcion-test').forEach((boton) => {
        boton.addEventListener('click', () => {
          clavesElegidas.push(boton.dataset.perfil);
          if (indice < test.preguntas.length - 1) {
            indice++;
            dibujar();
          } else {
            router.ir('testResult', { testId, clavesElegidas });
          }
        });
      });
    }

    dibujar();
  }
};
