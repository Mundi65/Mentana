// /games/engranajes.js — categoría: logica
// Inspirado en las matrices de razonamiento abstracto (estilo Raven, sin
// copiar sus figuras): el jugador descubre el patrón de una secuencia visual
// y elige la pieza que la completa. Mide razonamiento no verbal.

const FORMAS = ['▲', '■', '★', '●', '◆', '▼'];
const COLOR_VARS = ['--cat-atencion', '--cat-memoria', '--cat-calculo', '--cat-velocidad', '--cat-logica'];

function generarItemPuntos(n) {
  return '●'.repeat(n);
}

function generarRonda() {
  const tipo = ['puntos', 'forma', 'color'][Math.floor(Math.random() * 3)];

  if (tipo === 'puntos') {
    const inicio = 1 + Math.floor(Math.random() * 3);
    const secuencia = [inicio, inicio + 1, inicio + 2];
    const correcto = inicio + 3;
    const opciones = new Set([correcto]);
    while (opciones.size < 4) {
      const candidato = correcto + (Math.floor(Math.random() * 5) - 2);
      if (candidato > 0 && candidato !== correcto) opciones.add(candidato);
    }
    return {
      secuencia: secuencia.map(generarItemPuntos),
      opciones: Array.from(opciones).sort(() => Math.random() - 0.5).map(generarItemPuntos),
      correctaTexto: generarItemPuntos(correcto),
      esEstilo: 'texto'
    };
  }

  if (tipo === 'forma') {
    const inicio = Math.floor(Math.random() * FORMAS.length);
    const secuencia = [0, 1, 2].map(i => FORMAS[(inicio + i) % FORMAS.length]);
    const correcta = FORMAS[(inicio + 3) % FORMAS.length];
    const opciones = new Set([correcta]);
    while (opciones.size < 4) {
      opciones.add(FORMAS[Math.floor(Math.random() * FORMAS.length)]);
    }
    return {
      secuencia,
      opciones: Array.from(opciones).sort(() => Math.random() - 0.5),
      correctaTexto: correcta,
      esEstilo: 'texto'
    };
  }

  // tipo 'color'
  const inicio = Math.floor(Math.random() * COLOR_VARS.length);
  const secuencia = [0, 1, 2].map(i => COLOR_VARS[(inicio + i) % COLOR_VARS.length]);
  const correcta = COLOR_VARS[(inicio + 3) % COLOR_VARS.length];
  const opciones = new Set([correcta]);
  while (opciones.size < 4) {
    opciones.add(COLOR_VARS[Math.floor(Math.random() * COLOR_VARS.length)]);
  }
  return {
    secuencia,
    opciones: Array.from(opciones).sort(() => Math.random() - 0.5),
    correctaTexto: correcta,
    esEstilo: 'color'
  };
}

function renderizarItem(valor, esEstilo) {
  if (esEstilo === 'color') {
    return `<div style="width:36px; height:36px; flex-shrink:0; border-radius: var(--radio-sm); background: var(${valor});"></div>`;
  }
  return `<span style="font-size: 1.8rem;">${valor}</span>`;
}

export default {
  id: 'engranajes',
  name: 'Engranajes',
  category: 'logica',
  skills: ['resolucion_problemas', 'flexibilidad_cognitiva'],
  icon: '⚙️',
  instructions: 'Descubre el patrón de la secuencia y toca la pieza que la completa.',

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        trialsPerStage: 4 + level,
        tiempoPorTrialMs: Math.max(3000, 5000 - level * 150)
      }
    };
  },

  mount(container, ctx) {
    const { trialsPerStage, tiempoPorTrialMs } = ctx.config.params;
    let stage = 1;
    let trial = 0;
    let rondaActual = null;
    let yaRespondio = false;
    let timerTrial = null;

    container.innerHTML = `
      <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--esp-6); padding: var(--esp-5);">
        <div class="eyebrow" id="engranajes-etapa"></div>
        <div id="engranajes-secuencia" style="display:flex; gap: var(--esp-3); align-items:center;"></div>
        <div id="engranajes-opciones" style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--esp-3); width: min(280px, 90vw);"></div>
      </div>
    `;

    const elSecuencia = container.querySelector('#engranajes-secuencia');
    const elEtapa = container.querySelector('#engranajes-etapa');
    const contOpciones = container.querySelector('#engranajes-opciones');

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
      rondaActual = generarRonda();
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages} · ${trial}/${trialsPerStage}`;

      const celdasHTML = rondaActual.secuencia.map(v => `
        <div class="tarjeta" style="width:60px; height:60px; padding:0; display:flex; align-items:center; justify-content:center;">${renderizarItem(v, rondaActual.esEstilo)}</div>
      `).join('') + `
        <div class="tarjeta" style="width:60px; height:60px; padding:0; display:flex; align-items:center; justify-content:center; border-color: var(--color-filo); color: var(--color-texto-tenue); font-size:1.5rem;">?</div>
      `;
      elSecuencia.innerHTML = celdasHTML;

      contOpciones.innerHTML = '';
      rondaActual.opciones.forEach((valor) => {
        const b = document.createElement('button');
        b.className = 'boton boton--primario';
        b.style.minHeight = '52px';
        b.dataset.valor = valor;
        b.innerHTML = renderizarItem(valor, rondaActual.esEstilo);
        contOpciones.appendChild(b);
      });

      timerTrial = setTimeout(() => {
        if (!yaRespondio) ctx.reportAnswer(false);
        siguienteTrial();
      }, tiempoPorTrialMs);
    }

    contOpciones.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton || yaRespondio || rondaActual == null) return;
      yaRespondio = true;
      ctx.reportAnswer(boton.dataset.valor === rondaActual.correctaTexto);
    });

    ctx.onCleanup(() => { if (timerTrial) clearTimeout(timerTrial); });

    ctx.startStage(stage);
    siguienteTrial();
  }
};
