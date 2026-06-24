// /games/ecoPatrones.js — categoría: memoria
// Basado en el Corsi Block-Tapping Test (estándar clínico de memoria espacial):
// se iluminan casillas de una cuadrícula en secuencia; el jugador las repite
// tocándolas en el mismo orden.

export default {
  id: 'eco-patrones',
  name: 'Eco de Patrones',
  category: 'memoria',
  skills: ['memoria_corto_plazo', 'memoria_trabajo'],
  icon: '🔷',
  instructions: 'Memoriza el orden en que se iluminan las casillas y tócalas en el mismo orden.',
  comoJugar: [
    'Observa: algunas casillas se van a iluminar en un orden.',
    'Cuando termine de mostrar, toca las MISMAS casillas en el MISMO orden.',
    'Si te equivocas en una, esa etapa termina y empieza la siguiente.',
    'Cada etapa agrega una casilla más a recordar.'
  ],

  difficulty(level) {
    return {
      stages: 4,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        gridSize: Math.min(5, 3 + Math.floor((level - 1) / 2)),
        secuenciaBase: 2 + level
      }
    };
  },

  mount(container, ctx) {
    const { gridSize, secuenciaBase } = ctx.config.params;
    const totalCeldas = gridSize * gridSize;
    let stage = 1;
    const timers = [];

    container.innerHTML = `
      <div class="pantalla" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--esp-5); padding: var(--esp-5);">
        <div class="eyebrow" id="eco-etapa"></div>
        <div id="eco-grid" style="display:grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: var(--esp-2); width: min(320px, 90vw);"></div>
        <p id="eco-mensaje" style="color: var(--color-texto-tenue); min-height: 1.2em;"></p>
      </div>
    `;

    const grid = container.querySelector('#eco-grid');
    const elEtapa = container.querySelector('#eco-etapa');
    const elMensaje = container.querySelector('#eco-mensaje');
    const celdas = [];

    for (let i = 0; i < totalCeldas; i++) {
      const celda = document.createElement('button');
      celda.style.aspectRatio = '1';
      celda.style.borderRadius = 'var(--radio-md)';
      celda.style.border = '1px solid var(--color-borde)';
      celda.style.background = 'var(--color-superficie-2)';
      celda.style.cursor = 'pointer';
      celda.style.transition = 'background var(--trans-rapida)';
      celda.dataset.indice = i;
      grid.appendChild(celda);
      celdas.push(celda);
    }

    function iluminar(indice, encendido) {
      celdas[indice].style.background = encendido ? 'var(--cat-memoria)' : 'var(--color-superficie-2)';
    }

    function correrEtapa() {
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages}`;
      elMensaje.textContent = 'Observa...';
      celdas.forEach(c => (c.disabled = true));

      const longitud = secuenciaBase + (stage - 1);
      const secuencia = [];
      for (let i = 0; i < longitud; i++) {
        secuencia.push(Math.floor(Math.random() * totalCeldas));
      }

      let i = 0;
      function mostrarSiguiente() {
        if (i >= secuencia.length) {
          elMensaje.textContent = '¡Tu turno! Toca las casillas en el mismo orden.';
          celdas.forEach(c => (c.disabled = false));
          escucharTurnoJugador(secuencia);
          return;
        }
        const indice = secuencia[i];
        iluminar(indice, true);
        timers.push(setTimeout(() => {
          iluminar(indice, false);
          i++;
          timers.push(setTimeout(mostrarSiguiente, 200));
        }, 500));
      }
      mostrarSiguiente();
    }

    function escucharTurnoJugador(secuencia) {
      let posicion = 0;

      function alTocar(evento) {
        const celda = evento.target.closest('button');
        if (!celda) return;
        const indice = Number(celda.dataset.indice);
        const correcto = indice === secuencia[posicion];
        ctx.reportAnswer(correcto);

        if (!correcto) {
          celdas.forEach(c => (c.disabled = true));
          grid.removeEventListener('click', alTocar);
          terminarEtapa();
          return;
        }

        iluminar(indice, true);
        timers.push(setTimeout(() => iluminar(indice, false), 200));
        posicion++;

        if (posicion >= secuencia.length) {
          celdas.forEach(c => (c.disabled = true));
          grid.removeEventListener('click', alTocar);
          terminarEtapa();
        }
      }

      grid.addEventListener('click', alTocar);
    }

    function terminarEtapa() {
      ctx.finishStage();
      if (stage < ctx.config.stages) {
        stage++;
        timers.push(setTimeout(correrEtapa, 400));
      } else {
        ctx.finishGame();
      }
    }

    ctx.onCleanup(() => timers.forEach(clearTimeout));
    ctx.startStage(stage);
    correrEtapa();
  }
};
