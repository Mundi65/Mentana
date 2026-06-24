// Pantalla: perfil — resumen del usuario (pestaña "Perfil").
// Muestra racha, estado de acceso (prueba/suscripción) y accesos rápidos
// a Progreso y Logros (que siguen siendo pantallas propias, más completas).

import store from '../store.js';
import router from '../router.js';
import { obtenerRacha, rachaEstaActiva } from '../streak.js';
import { montarNav, ALTO_NAV } from '../navInferior.js';

function diasDesde(fechaISO) {
  const a = new Date(fechaISO + 'T00:00:00');
  const b = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

function textoAcceso(estado) {
  if (estado.suscripcion.activa) {
    return `Plan ${estado.suscripcion.plan === 'anual' ? 'Anual' : 'Mensual'} activo`;
  }
  if (estado.prueba.inicio) {
    const restantes = Math.max(0, estado.prueba.diasTotales - diasDesde(estado.prueba.inicio));
    return `Prueba gratis: ${restantes} día${restantes === 1 ? '' : 's'} restantes`;
  }
  return 'Sin plan activo';
}

export default {
  render(container) {
    const estado = store.obtener();
    const racha = obtenerRacha();
    const activa = rachaEstaActiva();

    container.innerHTML = `
      <div class="pantalla" style="max-width:480px; margin:auto; padding-bottom:${ALTO_NAV}px;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">Perfil</h1>

        <div class="tarjeta" style="margin-bottom: var(--esp-4);">
          <div style="display:flex; align-items:center; gap: var(--esp-3);">
            <span class="${activa ? 'racha-activa' : 'racha-inactiva'}" style="font-size:2rem;">🔥</span>
            <div>
              <div style="font-size: var(--txt-lg); font-weight:800;">${racha.actual} día${racha.actual === 1 ? '' : 's'} de racha</div>
              <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">Mejor racha: ${racha.mejor} días</div>
            </div>
          </div>
        </div>

        <div class="tarjeta" style="margin-bottom: var(--esp-5);">
          <div style="color: var(--color-texto-tenue); font-size: var(--txt-sm);">Tu plan</div>
          <div style="font-weight:700; margin-top: var(--esp-1);">${textoAcceso(estado)}</div>
        </div>

        <div class="fila-tarjeta" id="ir-progreso">
          <div class="fila-icono">📈</div>
          <div style="font-weight:700;">Tu progreso</div>
          <div class="fila-flecha">›</div>
        </div>

        <div class="fila-tarjeta" id="ir-logros">
          <div class="fila-icono">🏆</div>
          <div style="font-weight:700;">Logros</div>
          <div class="fila-flecha">›</div>
        </div>
      </div>
    `;

    container.querySelector('#ir-progreso').addEventListener('click', () => router.ir('progress'));
    container.querySelector('#ir-logros').addEventListener('click', () => router.ir('achievements'));

    montarNav(container, 'perfil');
  }
};
