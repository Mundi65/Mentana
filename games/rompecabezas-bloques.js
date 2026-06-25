// /games/rompecabezas-bloques.js — categoría: logica
// Clásico popular de internet (estilo "block blast"), hecho a la cara de
// MENTANA: coloca piezas de distintas formas en una cuadrícula; cuando una
// fila o columna queda completamente llena, desaparece y libera espacio.
// Entrena planificación espacial y flexibilidad cognitiva (encajar piezas
// pensando varios pasos adelante).

const COLORES = ['--cat-atencion', '--cat-memoria', '--cat-calculo', '--cat-velocidad', '--cat-logica'];

const PIEZAS_CHICAS = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]]
];

const PIEZAS_GRANDES = [
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 1]]
];

function piezaAleatoria(level) {
  const catalogo = level >= 2 ? [...PIEZAS_CHICAS, ...PIEZAS_GRANDES] : PIEZAS_CHICAS;
  const forma = catalogo[Math.floor(Math.random() * catalogo.length)];
  const color = COLORES[Math.floor(Math.random() * COLORES.length)];
  return { forma, color };
}

export default {
  id: 'rompecabezas-bloques',
  name: 'Rompecabezas de Bloques',
  category: 'logica',
  skills: ['resolucion_problemas', 'flexibilidad_cognitiva'],
  icon: '🧱',
  instructions: 'Coloca cada pieza en el tablero para completar filas o columnas enteras y hacerlas desaparecer.',
  comoJugar: [
    'Toca una pieza de la bandeja para elegirla.',
    'Toca una casilla del tablero: ahí se coloca la esquina superior izquierda de la pieza.',
    'Si completas una fila o columna entera, desaparece y libera espacio.',
    'Coloca las 3 piezas de la ronda sin que el tablero se llene.'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: { gridSize: 6 }
    };
  },

  mount(container, ctx) {
    const { gridSize } = ctx.config.params;
    let stage = 1;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    let bandeja = [];
    let seleccionada = null;

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="eyebrow" id="bloques-etapa" style="margin-bottom: var(--esp-4);"></div>
        <div id="bloques-grid" style="display:grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 3px; width: min(280px, 80vw); aspect-ratio:1; margin-bottom: var(--esp-5);"></div>
        <div id="bloques-bandeja" style="display:flex; gap: var(--esp-3);"></div>
        <p id="bloques-mensaje" style="color: var(--color-texto-tenue); margin-top: var(--esp-4); min-height: 1.2em; text-align:center; max-width:300px;"></p>
      </div>
    `;

    const elGrid = container.querySelector('#bloques-grid');
    const elBandeja = container.querySelector('#bloques-bandeja');
    const elEtapa = container.querySelector('#bloques-etapa');
    const elMensaje = container.querySelector('#bloques-mensaje');

    function celdasDePieza(forma, f, c) {
      return forma.map(([df, dc]) => [f + df, c + dc]);
    }

    function cabePieza(forma, f, c) {
      return celdasDePieza(forma, f, c).every(([ff, cc]) =>
        ff >= 0 && ff < gridSize && cc >= 0 && cc < gridSize && grid[ff][cc] === null
      );
    }

    function hayPosicionValida(forma) {
      for (let f = 0; f < gridSize; f++) {
        for (let c = 0; c < gridSize; c++) {
          if (cabePieza(forma, f, c)) return true;
        }
      }
      return false;
    }

    function despejarLineas() {
      const filas = [];
      for (let f = 0; f < gridSize; f++) if (grid[f].every(v => v !== null)) filas.push(f);
      const cols = [];
      for (let c = 0; c < gridSize; c++) if (grid.every(fila => fila[c] !== null)) cols.push(c);
      filas.forEach(f => { for (let c = 0; c < gridSize; c++) grid[f][c] = null; });
      cols.forEach(c => { for (let f = 0; f < gridSize; f++) grid[f][c] = null; });
    }

    function dibujarGrid() {
      let html = '';
      for (let f = 0; f < gridSize; f++) {
        for (let c = 0; c < gridSize; c++) {
          const valor = grid[f][c];
          html += `<button data-f="${f}" data-c="${c}" style="
            width:100%; height:100%; padding:0; cursor:pointer; border-radius:4px;
            border: 1px solid var(--color-borde);
            background: ${valor ? `var(${valor})` : 'var(--color-superficie-2)'};
          "></button>`;
        }
      }
      elGrid.innerHTML = html;
    }

    function dibujarBandeja() {
      elBandeja.innerHTML = bandeja.map((pieza, i) => {
        const maxFila = Math.max(...pieza.forma.map(([df]) => df)) + 1;
        const maxCol = Math.max(...pieza.forma.map(([, dc]) => dc)) + 1;
        const celdas = new Set(pieza.forma.map(([df, dc]) => `${df}-${dc}`));
        let mini = '';
        for (let f = 0; f < maxFila; f++) {
          for (let c = 0; c < maxCol; c++) {
            const lleno = celdas.has(`${f}-${c}`);
            mini += `<div style="width:14px; height:14px; border-radius:2px; background:${lleno ? `var(${pieza.color})` : 'transparent'};"></div>`;
          }
        }
        const elegida = i === seleccionada;
        return `
          <button data-indice="${i}" style="
            display:grid; grid-template-columns: repeat(${maxCol}, 14px); gap:2px;
            padding: var(--esp-3); border-radius: var(--radio-md); cursor:pointer;
            background: var(--color-superficie-2);
            border: 2px solid ${elegida ? 'var(--color-filo)' : 'var(--color-borde)'};
          ">${mini}</button>
        `;
      }).join('');
    }

    function comprobarFinRonda() {
      if (bandeja.length === 0) {
        elMensaje.textContent = '¡Ronda completa!';
        setTimeout(terminarEtapa, 500);
      }
    }

    elBandeja.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton) return;
      const i = Number(boton.dataset.indice);

      if (i === seleccionada) {
        if (!hayPosicionValida(bandeja[i].forma)) {
          bandeja.splice(i, 1); // pieza imposible de colocar: se descarta.
          seleccionada = null;
          elMensaje.textContent = '';
          dibujarBandeja();
          comprobarFinRonda();
        }
        return;
      }

      seleccionada = i;
      elMensaje.textContent = hayPosicionValida(bandeja[i].forma)
        ? ''
        : 'Esta pieza no entra en ningún lado. Tócala otra vez para descartarla.';
      dibujarBandeja();
    });

    elGrid.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton || seleccionada === null) return;
      const f = Number(boton.dataset.f);
      const c = Number(boton.dataset.c);
      const pieza = bandeja[seleccionada];
      const valido = cabePieza(pieza.forma, f, c);

      ctx.reportAnswer(valido);

      if (!valido) {
        elMensaje.textContent = 'Ahí no cabe.';
        return;
      }

      celdasDePieza(pieza.forma, f, c).forEach(([ff, cc]) => { grid[ff][cc] = pieza.color; });
      despejarLineas();
      bandeja.splice(seleccionada, 1);
      seleccionada = null;
      elMensaje.textContent = '';
      dibujarGrid();
      dibujarBandeja();
      comprobarFinRonda();
    });

    function nuevaRonda() {
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages}`;
      elMensaje.textContent = '';
      seleccionada = null;
      bandeja = [piezaAleatoria(ctx.level), piezaAleatoria(ctx.level), piezaAleatoria(ctx.level)];
      dibujarGrid();
      dibujarBandeja();
    }

    function terminarEtapa() {
      ctx.finishStage();
      if (stage < ctx.config.stages) {
        stage++;
        ctx.startStage(stage);
        nuevaRonda();
      } else {
        ctx.finishGame();
      }
    }

    ctx.startStage(stage);
    nuevaRonda();
  }
};
