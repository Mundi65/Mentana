// Pantalla: achievements — logros conseguidos y por conseguir.

import router from '../router.js';
import { logrosDesbloqueados, logrosPendientes } from '../achievements.js';
import { montarNav, ALTO_NAV } from '../navInferior.js';

function tarjetaLogro(logro, conseguido) {
  return `
    <div class="tarjeta" style="display:flex; align-items:center; gap: var(--esp-4); margin-bottom: var(--esp-3); ${conseguido ? '' : 'opacity: 0.45;'}">
      <div style="font-size:2rem;">${conseguido ? logro.icono : '🔒'}</div>
      <div>
        <div style="font-weight:700;">${logro.nombre}</div>
        <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">${logro.descripcion}</div>
      </div>
    </div>
  `;
}

export default {
  render(container) {
    const conseguidos = logrosDesbloqueados();
    const pendientes = logrosPendientes();

    container.innerHTML = `
      <div class="pantalla" style="max-width:480px; margin:auto; padding-bottom:${ALTO_NAV}px;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">Logros</h1>

        <div class="eyebrow" style="margin-bottom: var(--esp-3);">Conseguidos (${conseguidos.length})</div>
        ${conseguidos.length > 0 ? conseguidos.map(l => tarjetaLogro(l, true)).join('') : `<p style="color: var(--color-texto-tenue);">Todavía no tienes logros. ¡Sigue entrenando!</p>`}

        <div class="eyebrow" style="margin-top: var(--esp-5); margin-bottom: var(--esp-3);">Por conseguir (${pendientes.length})</div>
        ${pendientes.map(l => tarjetaLogro(l, false)).join('')}

        <button id="btn-volver" class="boton boton--fantasma" style="margin-top: var(--esp-6);">Volver</button>
      </div>
    `;

    container.querySelector('#btn-volver').addEventListener('click', () => router.ir('perfil'));
    montarNav(container, 'perfil');
  }
};
