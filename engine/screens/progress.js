// Pantalla: progress — tendencias en el tiempo.
// Junta el historial de partidas (guardado por gameRunner) agrupado por día
// y lo muestra como una barra simple por día (precisión promedio).

import store from '../store.js';
import router from '../router.js';
import { montarNav, ALTO_NAV } from '../navInferior.js';
import { montarBotonAtras } from '../botonAtras.js';

function ultimosNDias(n) {
  const dias = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dias.push(d.toISOString().slice(0, 10));
  }
  return dias;
}

function agruparPorDia(historial) {
  const porDia = {};
  for (const entrada of historial) {
    if (!porDia[entrada.fecha]) porDia[entrada.fecha] = [];
    porDia[entrada.fecha].push(entrada);
  }
  return porDia;
}

export default {
  render(container) {
    const estado = store.obtener();
    const porDia = agruparPorDia(estado.progreso.historial);
    const dias = ultimosNDias(14);

    const barrasHTML = dias.map((fecha) => {
      const entradas = porDia[fecha] || [];
      const promedioPrecision = entradas.length > 0
        ? Math.round(entradas.reduce((sum, e) => sum + e.precision, 0) / entradas.length)
        : 0;
      const dia = new Date(fecha + 'T00:00:00').getDate();
      return `
        <div style="display:flex; flex-direction:column; align-items:center; gap: var(--esp-1); flex:1;">
          <div style="width:100%; max-width:20px; height:120px; background: var(--color-superficie-2); border-radius: var(--radio-sm); display:flex; align-items:flex-end; overflow:hidden;">
            <div style="width:100%; height:${promedioPrecision}%; background: ${promedioPrecision > 0 ? 'var(--color-primario)' : 'transparent'}; transition: height var(--trans-media);"></div>
          </div>
          <span style="font-size: var(--txt-xs); color: var(--color-texto-tenue);">${dia}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="pantalla" style="max-width:480px; margin:auto; padding-bottom:${ALTO_NAV}px;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">Tu progreso</h1>

        <div style="display:flex; gap: var(--esp-3); margin-bottom: var(--esp-6);">
          <div class="tarjeta" style="flex:1; text-align:center;">
            <div class="puntuacion-grande" style="font-size: var(--txt-2xl);">${estado.racha.actual}</div>
            <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">racha actual</div>
          </div>
          <div class="tarjeta" style="flex:1; text-align:center;">
            <div class="puntuacion-grande" style="font-size: var(--txt-2xl);">${estado.racha.mejor}</div>
            <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">mejor racha</div>
          </div>
          <div class="tarjeta" style="flex:1; text-align:center;">
            <div class="puntuacion-grande" style="font-size: var(--txt-2xl);">${estado.sesiones.completadas}</div>
            <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">sesiones</div>
          </div>
        </div>

        <div class="eyebrow" style="margin-bottom: var(--esp-3);">Precisión promedio, últimos 14 días</div>
        <div style="display:flex; gap: var(--esp-2); align-items:flex-end;">${barrasHTML}</div>

        <button id="btn-volver" class="boton boton--fantasma" style="margin-top: var(--esp-6);">Volver</button>
      </div>
    `;

    container.querySelector('#btn-volver').addEventListener('click', () => router.ir('perfil'));
    montarNav(container, 'perfil');
    montarBotonAtras(container);
  }
};
