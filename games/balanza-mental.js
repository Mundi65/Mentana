// /games/balanzaMental.js — categoría: calculo
// Aritmética mental cronometrada: el jugador resuelve una operación y toca la
// respuesta correcta entre varias opciones antes de que se acabe el tiempo.

function generarOperacion(level) {
  const maxOperando = 8 + level * 4;
  const usaMultiplicacion = level >= 3 && Math.random() < 0.4;

  let a, b, operador, resultado;
  if (usaMultiplicacion) {
    a = 2 + Math.floor(Math.random() * 9);
    b = 2 + Math.floor(Math.random() * 9);
    operador = '×';
    resultado = a * b;
  } else if (Math.random() < 0.5) {
    a = 1 + Math.floor(Math.random() * maxOperando);
    b = 1 + Math.floor(Math.random() * maxOperando);
    operador = '+';
    resultado = a + b;
  } else {
    a = 1 + Math.floor(Math.random() * maxOperando);
    b = 1 + Math.floor(Math.random() * a);
    operador = '−';
    resultado = a - b;
  }

  return { texto: `${a} ${operador} ${b}`, resultado };
}

function generarOpciones(resultado) {
  const opciones = new Set([resultado]);
  while (opciones.size < 4) {
    const ruido = Math.floor(Math.random() * 9) - 4;
    const candidato = resultado + (ruido === 0 ? 5 : ruido);
    if (candidato >= 0) opciones.add(candidato);
  }
  return Array.from(opciones).sort(() => Math.random() - 0.5);
}

export default {
  id: 'balanza-mental',
  name: 'Balanza Mental',
  category: 'calculo',
  skills: ['calculo_mental', 'velocidad_procesamiento'],
  icon: '⚖️',
  instructions: 'Resuelve la operación y toca la respuesta correcta antes de que se acabe el tiempo.',

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        trialsPerStage: 6 + level,
        tiempoPorTrialMs: Math.max(2500, 4500 - level * 150)
      }
    };
  },

  mount(container, ctx) {
    const { trialsPerStage, tiempoPorTrialMs } = ctx.config.params;
    let stage = 1;
    let trial = 0;
    let resultadoActual = null;
    let yaRespondio = false;
    let timerTrial = null;

    container.innerHTML = `
      <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--esp-6); padding: var(--esp-5);">
        <div class="eyebrow" id="balanza-etapa"></div>
        <div id="balanza-operacion" style="font-family: var(--fuente-display); font-size: 3.5rem; font-weight: 800; min-height: 1.2em;"></div>
        <div id="balanza-opciones" style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--esp-3); width: min(280px, 90vw);"></div>
      </div>
    `;

    const elOperacion = container.querySelector('#balanza-operacion');
    const elEtapa = container.querySelector('#balanza-etapa');
    const contOpciones = container.querySelector('#balanza-opciones');

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
      const operacion = generarOperacion(ctx.level);
      resultadoActual = operacion.resultado;
      const opciones = generarOpciones(operacion.resultado);

      elOperacion.textContent = operacion.texto;
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages} · ${trial}/${trialsPerStage}`;

      contOpciones.innerHTML = '';
      opciones.forEach((valor) => {
        const b = document.createElement('button');
        b.className = 'boton boton--primario';
        b.textContent = valor;
        b.dataset.valor = valor;
        contOpciones.appendChild(b);
      });

      timerTrial = setTimeout(() => {
        if (!yaRespondio) ctx.reportAnswer(false);
        siguienteTrial();
      }, tiempoPorTrialMs);
    }

    contOpciones.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton || yaRespondio || resultadoActual == null) return;
      yaRespondio = true;
      ctx.reportAnswer(Number(boton.dataset.valor) === resultadoActual);
    });

    ctx.onCleanup(() => { if (timerTrial) clearTimeout(timerTrial); });

    ctx.startStage(stage);
    siguienteTrial();
  }
};
