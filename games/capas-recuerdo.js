// /games/capasRecuerdo.js — categoría: memoria
// Basado en el paradigma N-back (el más usado en investigación de memoria de
// trabajo): aparece un símbolo a la vez; el jugador indica si es igual al que
// apareció N pasos atrás.

import { ANIMALES } from './_iconos.js';

const SIMBOLOS = ANIMALES;

export default {
  id: 'capas-recuerdo',
  name: 'Capas del Recuerdo',
  category: 'memoria',
  skills: ['memoria_trabajo', 'concentracion'],
  icon: '🌀',
  instructions: 'Toca "¡Coincide!" cuando el símbolo actual sea igual al de unos pasos atrás.',
  comoJugar: [
    'Van a aparecer animales, uno a la vez, en el centro.',
    'Compara el animal actual con el que apareció un poco antes.',
    'Si son IGUALES, toca "¡Coincide!". Si son distintos, no toques nada.',
    'Empieza comparando con el animal justo anterior; sube de nivel cuando ya hayas dominado eso.'
  ],

  difficulty(level) {
    const n = Math.min(3, 1 + Math.floor((level - 1) / 2));
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        n,
        trialsPerStage: 8 + level,
        intervaloMs: Math.max(1200, 1700 - level * 60)
      }
    };
  },

  mount(container, ctx) {
    const { n, trialsPerStage, intervaloMs } = ctx.config.params;
    const historial = [];
    let stage = 1;
    let trial = 0;
    let yaRespondio = false;
    let timerTrial = null;

    container.innerHTML = `
      <div class="pantalla" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--esp-6); padding: var(--esp-5);">
        <div class="eyebrow" id="capas-etapa"></div>
        <p style="color: var(--color-texto-tenue);">Compara con ${n} paso${n === 1 ? '' : 's'} atrás</p>
        <div id="capas-simbolo" style="font-size: 5rem; color: var(--cat-memoria); min-height:1.2em;"></div>
        <button id="capas-btn" class="boton boton--filo" style="max-width: 240px;">¡Coincide!</button>
      </div>
    `;

    const elSimbolo = container.querySelector('#capas-simbolo');
    const elEtapa = container.querySelector('#capas-etapa');
    const btn = container.querySelector('#capas-btn');

    function siguienteTrial() {
      if (trial >= trialsPerStage) {
        ctx.finishStage();
        if (stage < ctx.config.stages) {
          stage++;
          trial = 0;
          ctx.startStage(stage);
          siguienteTrial();
        } else {
          ctx.finishGame();
        }
        return;
      }

      trial++;
      yaRespondio = false;

      const indiceActual = historial.length >= n && Math.random() < 0.3
        ? SIMBOLOS.indexOf(historial[historial.length - n])
        : Math.floor(Math.random() * SIMBOLOS.length);

      const simboloActual = SIMBOLOS[indiceActual];
      historial.push(simboloActual);

      elSimbolo.textContent = simboloActual;
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages} · ${trial}/${trialsPerStage}`;

      const hayCoincidencia = historial.length > n && historial[historial.length - 1 - n] === simboloActual;

      timerTrial = setTimeout(() => {
        if (!yaRespondio) {
          ctx.reportAnswer(!hayCoincidencia); // no tocó: correcto solo si NO había coincidencia.
        }
        siguienteTrial();
      }, intervaloMs);
    }

    btn.addEventListener('click', () => {
      if (yaRespondio || historial.length === 0) return;
      yaRespondio = true;
      const hayCoincidencia = historial.length > n && historial[historial.length - 1 - n] === historial[historial.length - 1];
      ctx.reportAnswer(hayCoincidencia);
    });

    ctx.onCleanup(() => { if (timerTrial) clearTimeout(timerTrial); });

    ctx.startStage(stage);
    siguienteTrial();
  }
};
