// Pantalla: welcome — bienvenida inicial del onboarding.
// Muestra marca + eslogan (del config) y un botón para empezar la encuesta.

import appConfig from '../../config/app.config.js';
import onboarding from '../onboarding.js';

export default {
  render(container) {
    container.innerHTML = `
      <div class="pantalla" style="display:flex; align-items:center; justify-content:center; padding: var(--esp-5);">
        <div class="tarjeta" style="text-align:center; max-width:340px; width:100%;">
          <div style="font-size:3rem;">${appConfig.marca.icono}</div>
          <h1 class="display" style="font-size: var(--txt-2xl); margin-top: var(--esp-3);">${appConfig.textos.bienvenidaTitulo}</h1>
          <p style="color: var(--color-texto-tenue); margin-top: var(--esp-2);">${appConfig.textos.bienvenidaSubtitulo}</p>
          <button id="btn-empezar" class="boton boton--filo" style="margin-top: var(--esp-6);">${appConfig.textos.botonEmpezar}</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-empezar').addEventListener('click', () => {
      onboarding.irASurvey();
    });
  }
};
