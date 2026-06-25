// /games/conecta-tuberias.js — categoría: logica
// Clásico popular de internet (estilo "Flow"), hecho a la cara de MENTANA:
// conecta cada par de puntos del mismo color con una línea, sin que las
// líneas se crucen entre sí. Entrena planificación espacial y flexibilidad
// cognitiva (reorganizar el plan cuando un camino bloquea a otro).
//
// Generación SIEMPRE resoluble: se traza un camino que recorre TODO el
// tablero en zigzag (como una serpiente) y se corta en tramos al azar; cada
// tramo es un color. Como los tramos nunca se superponen (son pedazos de un
// mismo camino), siempre existe al menos una forma de conectar todos los
// colores a la vez.

const COLORES = ['--cat-atencion', '--cat-memoria', '--cat-calculo', '--cat-velocidad', '--cat-logica'];

function construirSerpiente(n) {
  const celdas = [];
  for (let fila = 0; fila < n; fila++) {
    if (fila % 2 === 0) {
      for (let col = 0; col < n; col++) celdas.push([fila, col]);
    } else {
      for (let col = n - 1; col >= 0; col--) celdas.push([fila, col]);
    }
  }
  return celdas;
}

function repartirLongitudes(total, k) {
  const longitudes = Array(k).fill(2);
  let restante = total - 2 * k;
  while (restante > 0) {
    longitudes[Math.floor(Math.random() * k)]++;
    restante--;
  }
  return longitudes;
}

function generarPuzzle(n, numColores) {
  const serpiente = construirSerpiente(n);
  const longitudes = repartirLongitudes(serpiente.length, numColores);
  const colores = [];
  let cursor = 0;
  for (let i = 0; i < numColores; i++) {
    const tramo = serpiente.slice(cursor, cursor + longitudes[i]);
    colores.push({
      color: COLORES[i],
      dotA: tramo[0],
      dotB: tramo[tramo.length - 1],
      ruta: [],
      conectado: false
    });
    cursor += longitudes[i];
  }
  return colores;
}

function esAdyacente(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

function esMismaCelda(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

export default {
  id: 'conecta-tuberias',
  name: 'Conecta Tuberías',
  category: 'logica',
  skills: ['resolucion_problemas', 'flexibilidad_cognitiva'],
  icon: '🔌',
  instructions: 'Conecta cada par de puntos del mismo color con una línea, sin que se crucen entre sí.',
  comoJugar: [
    'Toca un punto de color para empezar a dibujar desde ahí.',
    'Toca celdas vecinas (arriba, abajo, izquierda o derecha) para extender la línea.',
    'Llega hasta el otro punto del MISMO color para conectarlo.',
    'Las líneas no pueden cruzarse ni pasar por el punto de otro color.'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        gridSize: Math.min(6, 4 + Math.floor((level - 1) / 3)),
        numColores: Math.min(5, 3 + Math.floor((level - 1) / 2))
      }
    };
  },

  mount(container, ctx) {
    const { gridSize, numColores } = ctx.config.params;
    let stage = 1;
    let colores = [];
    let colorActivo = null;

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="eyebrow" id="tuberias-etapa" style="margin-bottom: var(--esp-5);"></div>
        <div id="tuberias-grid" style="display:grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 4px; width: min(320px, 85vw); aspect-ratio: 1;"></div>
        <p id="tuberias-mensaje" style="color: var(--color-texto-tenue); margin-top: var(--esp-5); min-height: 1.2em;"></p>
      </div>
    `;

    const elGrid = container.querySelector('#tuberias-grid');
    const elEtapa = container.querySelector('#tuberias-etapa');
    const elMensaje = container.querySelector('#tuberias-mensaje');

    function encontrarDot(f, c) {
      for (let i = 0; i < colores.length; i++) {
        if (esMismaCelda(colores[i].dotA, [f, c]) || esMismaCelda(colores[i].dotB, [f, c])) return i;
      }
      return null;
    }

    function reconstruirOcupado() {
      const ocupado = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
      colores.forEach((c, i) => {
        ocupado[c.dotA[0]][c.dotA[1]] = i;
        ocupado[c.dotB[0]][c.dotB[1]] = i;
        c.ruta.forEach(([f, co]) => { ocupado[f][co] = i; });
      });
      return ocupado;
    }

    function dibujarGrid() {
      const ocupado = reconstruirOcupado();
      let html = '';
      for (let f = 0; f < gridSize; f++) {
        for (let c = 0; c < gridSize; c++) {
          const dot = encontrarDot(f, c);
          if (dot !== null) {
            const conectado = colores[dot].conectado;
            html += `<button data-f="${f}" data-c="${c}" style="
              width:100%; height:100%; padding:0; cursor:pointer;
              border-radius: 50%; border: 3px solid ${conectado ? 'var(--color-exito)' : 'var(--color-borde)'};
              background: var(${colores[dot].color});
            "></button>`;
          } else if (ocupado[f][c] !== null) {
            html += `<button data-f="${f}" data-c="${c}" style="
              width:100%; height:100%; padding:0; cursor:pointer;
              border-radius: 4px; border:none;
              background: color-mix(in srgb, var(${colores[ocupado[f][c]].color}) 65%, transparent);
            "></button>`;
          } else {
            html += `<button data-f="${f}" data-c="${c}" style="
              width:100%; height:100%; padding:0; cursor:pointer;
              border-radius: 4px; border: 1px solid var(--color-borde);
              background: var(--color-superficie-2);
            "></button>`;
          }
        }
      }
      elGrid.innerHTML = html;
    }

    function comprobarVictoria() {
      if (colores.every(c => c.conectado)) {
        elMensaje.textContent = '¡Resuelto!';
        setTimeout(terminarEtapa, 500);
      }
    }

    elGrid.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton) return;
      const f = Number(boton.dataset.f);
      const c = Number(boton.dataset.c);
      const dot = encontrarDot(f, c);

      if (dot !== null) {
        const elColor = colores[dot];
        if (colorActivo === dot && elColor.ruta.length > 0) {
          const ultimo = elColor.ruta[elColor.ruta.length - 1];
          if (esAdyacente(ultimo, [f, c]) && !esMismaCelda(ultimo, [f, c])) {
            elColor.ruta.push([f, c]);
            elColor.conectado = true;
            ctx.reportAnswer(true);
            colorActivo = null;
            elMensaje.textContent = '';
            dibujarGrid();
            comprobarVictoria();
            return;
          }
        }
        // (Re)empezar este color desde el punto tocado.
        colorActivo = dot;
        elColor.ruta = [[f, c]];
        elColor.conectado = false;
        elMensaje.textContent = '';
        dibujarGrid();
        return;
      }

      if (colorActivo === null) return;
      const activo = colores[colorActivo];
      const ultimo = activo.ruta[activo.ruta.length - 1];
      const ocupado = reconstruirOcupado();
      const libre = ocupado[f][c] === null;
      const adyacente = esAdyacente(ultimo, [f, c]);
      const valido = libre && adyacente;

      ctx.reportAnswer(valido);
      if (valido) {
        activo.ruta.push([f, c]);
        dibujarGrid();
      } else {
        elMensaje.textContent = 'Ahí no se puede.';
      }
    });

    function correrEtapa() {
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages}`;
      elMensaje.textContent = '';
      colorActivo = null;
      colores = generarPuzzle(gridSize, numColores);
      dibujarGrid();
    }

    function terminarEtapa() {
      ctx.finishStage();
      if (stage < ctx.config.stages) {
        stage++;
        ctx.startStage(stage);
        correrEtapa();
      } else {
        ctx.finishGame();
      }
    }

    ctx.startStage(stage);
    correrEtapa();
  }
};
