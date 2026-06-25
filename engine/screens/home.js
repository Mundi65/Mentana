// Pantalla: home — pantalla principal. Muestra la racha y el botón para
// empezar (o continuar) la sesión de juegos del día. Navegación a Juegos,
// Tests y Perfil vive en la barra inferior (navInferior.js).

import appConfig from '../../config/app.config.js';
import router from '../router.js';
import { obtenerRacha, rachaEstaActiva } from '../streak.js';
import { sesionDeHoy } from '../session.js';
import { montarNav, ALTO_NAV } from '../navInferior.js';
import { montarBotonAtras } from '../botonAtras.js';

export default {
  render(container) {
    const racha = obtenerRacha();
    const activa = rachaEstaActiva();
    const sesion = sesionDeHoy();
    const restantes = sesion.juegosId.length - sesion.indiceActual;
    const textoBoton = sesion.completada
      ? 'Sesión de hoy completada ✅'
      : (sesion.indiceActual > 0 ? 'Continuar sesión' : appConfig.textos.botonEmpezar);

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center; padding-bottom:${ALTO_NAV}px;">
        <div class="tarjeta" style="text-align:center; max-width:340px; width:100%;">
          <div style="font-size:2rem;">${appConfig.marca.icono}</div>
          <h1 class="display" style="font-size: var(--txt-xl); margin-top: var(--esp-2);">${appConfig.textos.homeTitulo}</h1>

          <div style="margin-top: var(--esp-4); display:flex; align-items:center; justify-content:center; gap: var(--esp-2);">
            <span class="${activa ? 'racha-activa' : 'racha-inactiva'}" style="font-size:1.5rem;">🔥</span>
            <span style="font-size: var(--txt-lg); font-weight:700;">${racha.actual} día${racha.actual === 1 ? '' : 's'}</span>
          </div>

          <p style="color: var(--color-texto-tenue); margin-top: var(--esp-3);">
            ${sesion.completada ? '¡Buen trabajo hoy!' : `Te quedan ${restantes} juego${restantes === 1 ? '' : 's'} en tu sesión de hoy.`}
          </p>

          <button id="btn-sesion" class="boton boton--filo" style="margin-top: var(--esp-5);" ${sesion.completada ? 'disabled' : ''}>
            ${textoBoton}
          </button>
        </div>
      </div>
    `;

    const btn = container.querySelector('#btn-sesion');
    if (!sesion.completada) {
      btn.addEventListener('click', () => {
        const juegoId = sesion.juegosId[sesion.indiceActual];
        router.ir('gameIntro', { juegoId });
      });
    }

    montarNav(container, 'hoy');
    montarBotonAtras(container);
  }
};
