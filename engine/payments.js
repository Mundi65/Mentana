// =========================================================================
// MOTOR: payments.js — ENRUTADOR de pagos + adaptadores.
// El enrutador elige una pasarela según el país (config.pagos) y le entrega
// el plan elegido. Cada pasarela es un ADAPTADOR con la misma interfaz fija:
//   async intentarCobro(plan, ctx) -> { estado: 'exito'|'cancelado'|'fallo', referencia? }
// v1: solo existe el adaptador STUB (siempre 'cancelado'), así se puede
// probar TODO el flujo sin cobrar de verdad. Fase 2 agrega adaptadores
// reales (PayPhone, Stripe/PayPal, Mercado Pago) sin tocar este archivo más
// que para sumar una línea al mapa `adaptadores`.
// =========================================================================

import appConfig from '../config/app.config.js';

// ---- Adaptador STUB: no cobra nada, siempre cancela. ----
const adaptadorStub = {
  async intentarCobro(plan, ctx) {
    return { estado: 'cancelado' };
  }
};

// Mapa de nombre de pasarela -> adaptador. Fase 2 agrega aquí 'payphone', etc.
const adaptadores = {
  stub: adaptadorStub
};

function elegirNombrePasarela(pais) {
  const { pasarelasPorRegion, respaldoGlobal } = appConfig.pagos;
  return pasarelasPorRegion[pais] || respaldoGlobal;
}

export const payments = {

  // Intenta cobrar un plan para el país dado (o el país por defecto del config).
  // Devuelve siempre { estado, referencia? } sin importar la pasarela usada.
  async intentarCobro(plan, ctx = {}) {
    const pais = ctx.pais || appConfig.pagos.paisPorDefecto;
    const nombrePasarela = elegirNombrePasarela(pais);
    const adaptador = adaptadores[nombrePasarela];

    if (!adaptador) {
      return { estado: 'fallo', motivo: 'pasarela-no-disponible' };
    }
    return adaptador.intentarCobro(plan, ctx);
  }
};

export default payments;
