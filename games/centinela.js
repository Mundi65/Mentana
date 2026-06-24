// /games/centinela.js — categoría: atencion
// Basado en el paradigma clínico SART (Sustained Attention to Response Task):
// el jugador responde a casi todos los estímulos, EXCEPTO a uno específico
// ("no-go"), donde debe contenerse. Mide atención sostenida e impulsividad.

const LETRAS_GO = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K', 'L'];
const LETRA_NOGO = 'Q';

function letraAleatoria(probabilidadNoGo) {
  return Math.random() < probabilidadNoGo
    ? LETRA_NOGO
    : LETRAS_GO[Math.floor(Math.random() * LETRAS_GO.length)];
}

export default {
  id: 'centinela',
  name: 'Centinela',
  category: 'atencion',
  skills: ['atencion', 'concentracion'],
  icon: '🛡️',
  instructions: 'Toca "¡Ahora!" en cada letra... excepto cuando aparezca la Q. Ahí debes contenerte.',
  comoJugar: [
    'Van a aparecer letras, una tras otra, a un ritmo constante.',
    'Toca el botón "¡Ahora!" en cuanto veas cualquier letra normal.',
    'Si aparece la letra Q, NO toques nada: déjala pasar.',
    'Cada etapa se pone un poco más rápida.'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        trialsPerStage: 8 + level * 2,
        intervaloMs: Math.max(550, 1100 - level * 50),
        probabilidadNoGo: Math.min(0.35, 0.10 + level * 0.02)
      }
    };
  },

  mount(container, ctx) {
    const { trialsPerStage, intervaloMs, probabilidadNoGo } = ctx.config.params;
    let stage = 1;
    let trial = 0;
    let letraActual = null;
    let yaRespondio = false;
    let timerTrial = null;

    container.innerHTML = `
      <div class="pantalla" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--esp-6); padding: var(--esp-5);">
        <div class="eyebrow" id="centinela-etapa"></div>
        <div id="centinela-letra" style="font-family: var(--fuente-display); font-size: 6rem; font-weight: 800; color: var(--cat-atencion); min-height: 1.2em;"></div>
        <button id="centinela-btn" class="boton boton--filo" style="max-width: 240px;">¡Ahora!</button>
      </div>
    `;

    const elLetra = container.querySelector('#centinela-letra');
    const elEtapa = container.querySelector('#centinela-etapa');
    const btn = container.querySelector('#centinela-btn');

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
      letraActual = letraAleatoria(probabilidadNoGo);
      elLetra.textContent = letraActual;
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages} · ${trial}/${trialsPerStage}`;

      timerTrial = setTimeout(() => {
        // Se acabó el tiempo de este estímulo sin que el jugador tocara.
        if (!yaRespondio) {
          const eraNoGo = letraActual === LETRA_NOGO;
          ctx.reportAnswer(eraNoGo); // correcto si era no-go (contenerse era lo debido).
        }
        siguienteTrial();
      }, intervaloMs);
    }

    btn.addEventListener('click', () => {
      if (yaRespondio || letraActual == null) return;
      yaRespondio = true;
      const eraNoGo = letraActual === LETRA_NOGO;
      ctx.reportAnswer(!eraNoGo); // correcto si tocó en un go; incorrecto si tocó en el no-go.
    });

    ctx.onCleanup(() => {
      if (timerTrial) clearTimeout(timerTrial);
    });

    ctx.startStage(stage);
    siguienteTrial();
  }
};
