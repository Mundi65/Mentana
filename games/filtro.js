// /games/filtro.js — categoría: atencion
// Basado en tareas de atención selectiva tipo Stroop: una palabra de color se
// muestra escrita en una TINTA distinta. El jugador debe tocar el color de la
// TINTA, ignorando lo que dice la palabra. Mide control de interferencia.

const COLORES = [
  { nombre: 'Ámbar', variable: '--cat-atencion' },
  { nombre: 'Verde', variable: '--cat-calculo' },
  { nombre: 'Rosa', variable: '--cat-velocidad' },
  { nombre: 'Azul', variable: '--cat-logica' }
];

export default {
  id: 'filtro',
  name: 'Filtro',
  category: 'atencion',
  skills: ['atencion', 'flexibilidad_cognitiva'],
  icon: '🎛️',
  instructions: 'Toca el color de la TINTA con la que está escrita la palabra, no lo que dice.',
  comoJugar: [
    'Va a aparecer una palabra de color, pero escrita con otra tinta.',
    'Ignora lo que DICE la palabra. Fíjate solo en el COLOR con el que está pintada.',
    'Toca el botón de ese color entre las 4 opciones.',
    'Al principio casi siempre coinciden; luego empiezan a contradecirse más.'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        trialsPerStage: 7 + level,
        intervaloMs: Math.max(1200, 1900 - level * 70),
        probabilidadConflicto: Math.min(0.85, 0.3 + level * 0.05)
      }
    };
  },

  mount(container, ctx) {
    const { trialsPerStage, intervaloMs, probabilidadConflicto } = ctx.config.params;
    let stage = 1;
    let trial = 0;
    let colorTintaActual = null;
    let yaRespondio = false;
    let timerTrial = null;

    container.innerHTML = `
      <div class="pantalla" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--esp-6); padding: var(--esp-5);">
        <div class="eyebrow" id="filtro-etapa"></div>
        <div id="filtro-palabra" style="font-family: var(--fuente-display); font-size: 3rem; font-weight: 800; min-height: 1.2em;"></div>
        <div id="filtro-botones" style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--esp-3); width: min(280px, 90vw);"></div>
      </div>
    `;

    const elPalabra = container.querySelector('#filtro-palabra');
    const elEtapa = container.querySelector('#filtro-etapa');
    const contBotones = container.querySelector('#filtro-botones');

    COLORES.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'boton boton--primario';
      b.style.background = `var(${c.variable})`;
      b.style.color = 'var(--color-texto-sobre-primario)';
      b.textContent = c.nombre;
      b.dataset.variable = c.variable;
      contBotones.appendChild(b);
    });

    function elegirPalabra(colorTinta) {
      if (Math.random() < probabilidadConflicto) {
        const otras = COLORES.filter(c => c.variable !== colorTinta.variable);
        return otras[Math.floor(Math.random() * otras.length)].nombre;
      }
      return colorTinta.nombre;
    }

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
      colorTintaActual = COLORES[Math.floor(Math.random() * COLORES.length)];
      const palabra = elegirPalabra(colorTintaActual);

      elPalabra.textContent = palabra;
      elPalabra.style.color = `var(${colorTintaActual.variable})`;
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages} · ${trial}/${trialsPerStage}`;

      timerTrial = setTimeout(() => {
        if (!yaRespondio) ctx.reportAnswer(false); // no respondió a tiempo: incorrecto.
        siguienteTrial();
      }, intervaloMs);
    }

    contBotones.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton || yaRespondio || colorTintaActual == null) return;
      yaRespondio = true;
      ctx.reportAnswer(boton.dataset.variable === colorTintaActual.variable);
    });

    ctx.onCleanup(() => { if (timerTrial) clearTimeout(timerTrial); });

    ctx.startStage(stage);
    siguienteTrial();
  }
};
