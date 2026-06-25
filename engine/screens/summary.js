// Pantalla: summary — resumen del plan, calculado por REGLAS (sin IA).
// Lee las respuestas de la encuesta del store y arma el texto usando
// reglasResumen de /config/app.config.js.

import appConfig from '../../config/app.config.js';
import store from '../store.js';
import onboarding from '../onboarding.js';
import { montarBotonAtras } from '../botonAtras.js';

// Convierte una lista de objetivos en texto natural: "memoria, atención y cálculo".
function listaEnTexto(items) {
  if (items.length === 0) return 'tu entrenamiento diario';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

function calcularHorizonte(minutosSemana, reglas) {
  const fila = reglas.horizonte.find(h => minutosSemana >= h.min);
  return fila ? fila.texto : reglas.horizonte[reglas.horizonte.length - 1].texto;
}

function calcularResumen(respuestas, reglas) {
  const minDia = respuestas.minDia || 5;
  const diasSemana = respuestas.diasSemana || 3;
  const minutosSemana = minDia * diasSemana;
  const horizonte = calcularHorizonte(minutosSemana, reglas);
  const objetivos = listaEnTexto((respuestas.objetivos || []).map(o => o.toLowerCase()));

  const texto = reglas.plantilla
    .replace('{objetivos}', objetivos)
    .replace('{minDia}', minDia)
    .replace('{diasSemana}', diasSemana)
    .replace('{horizonte}', horizonte)
    .replace('{diasSemana}', diasSemana);

  const nivelInicial = reglas.nivelInicialPorAuto[respuestas.autoNivel] || 1;

  return { texto, nivelInicial };
}

export default {
  render(container) {
    const estado = store.obtener();
    const { texto } = calcularResumen(estado.respuestasEncuesta, appConfig.reglasResumen);

    container.innerHTML = `
      <div class="pantalla" style="display:flex; align-items:center; justify-content:center; padding: var(--esp-5);">
        <div class="tarjeta" style="max-width:380px; width:100%;">
          <div class="eyebrow">${appConfig.textos.resumenTitulo}</div>
          <h1 class="display" style="font-size: var(--txt-xl); margin-top: var(--esp-2); margin-bottom: var(--esp-4);">${appConfig.marca.nombre}</h1>
          <p style="color: var(--color-texto);">${texto}</p>
          <button id="btn-continuar" class="boton boton--filo" style="margin-top: var(--esp-6);">${appConfig.textos.botonContinuar}</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-continuar').addEventListener('click', () => {
      onboarding.irAPaywall();
    });

    montarBotonAtras(container);
  }
};
