// Pantalla: paywall — muestra los planes, intenta el cobro (v1 = stub) y,
// si no se completa el pago, activa la prueba gratis y deja entrar a Home.
// También es el "muro de pago" cuando la prueba ya venció.

import appConfig from '../../config/app.config.js';
import store from '../store.js';
import payments from '../payments.js';
import router from '../router.js';
import { montarBotonAtras } from '../botonAtras.js';

function activarPruebaGratis() {
  store.actualizar((s) => {
    s.prueba.inicio = new Date().toISOString().slice(0, 10);
    s.prueba.diasTotales = appConfig.diasPrueba;
    s.onboardingCompleto = true;
    return s;
  });
}

function activarSuscripcion(planId) {
  store.actualizar((s) => {
    s.suscripcion.activa = true;
    s.suscripcion.plan = planId;
    s.suscripcion.desde = new Date().toISOString().slice(0, 10);
    s.onboardingCompleto = true;
    return s;
  });
}

export default {
  render(container) {
    const estado = store.obtener();
    const planesHTML = appConfig.planes.map((p) => `
      <div class="tarjeta" data-plan="${p.id}" style="margin-bottom: var(--esp-3); ${p.destacado ? `border-color: var(--color-filo);` : ''}">
        <div style="display:flex; justify-content:space-between; align-items:baseline;">
          <h3 class="display" style="font-size: var(--txt-lg);">${p.nombre}</h3>
          ${p.destacado ? `<span class="cat-chip cat-atencion">${p.ahorro || 'Recomendado'}</span>` : ''}
        </div>
        <p style="margin-top: var(--esp-2); color: var(--color-texto-tenue);">
          <span style="color: var(--color-texto); font-size: var(--txt-xl); font-weight:800;">$${p.precio}</span> ${p.moneda} / ${p.periodo}
        </p>
        <button class="boton boton--primario btn-elegir-plan" data-plan="${p.id}" style="margin-top: var(--esp-3);">Elegir</button>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="pantalla" style="padding: var(--esp-5); max-width:420px; margin:auto;">
        <h1 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">${appConfig.textos.paywallTitulo}</h1>
        ${planesHTML}
        <button id="btn-prueba-gratis" class="boton boton--fantasma" style="margin-top: var(--esp-4);">${appConfig.textos.botonProbarGratis} (${appConfig.diasPrueba} días)</button>
        <p id="mensaje-pago" style="color: var(--color-texto-tenue); margin-top: var(--esp-4); min-height: 1.2em;"></p>
      </div>
    `;

    const mensaje = container.querySelector('#mensaje-pago');

    container.querySelectorAll('.btn-elegir-plan').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const planId = btn.dataset.plan;
        mensaje.textContent = 'Procesando…';
        const resultado = await payments.intentarCobro(planId, { pais: estado.respuestasEncuesta.pais });

        if (resultado.estado === 'exito') {
          activarSuscripcion(planId);
          router.ir('home', {}, { reemplazar: true });
        } else {
          // 'cancelado' o 'fallo': no se cobró, activamos la prueba gratis.
          mensaje.textContent = 'No se completó el pago. Activamos tu prueba gratis.';
          activarPruebaGratis();
          router.ir('home', {}, { reemplazar: true });
        }
      });
    });

    container.querySelector('#btn-prueba-gratis').addEventListener('click', () => {
      activarPruebaGratis();
      router.ir('home', {}, { reemplazar: true });
    });

    montarBotonAtras(container);
  }
};
