// /games/sopa-de-letras.js — categoría: atencion
// Clásico popular de internet, hecho a la cara de MENTANA: encuentra
// palabras escondidas en una cuadrícula de letras, marcando inicio y fin
// de la línea (horizontal, vertical o diagonal). Entrena atención sostenida
// y exploración visual (búsqueda sistemática de un objetivo entre ruido).

const BANCO_PALABRAS = [
  'FOCO', 'CALMA', 'MENTE', 'LOGICA', 'MEMORIA', 'AGUDEZA',
  'ENFOQUE', 'RAPIDEZ', 'CEREBRO', 'ATENCION', 'DESTREZA', 'CLARIDAD'
];

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECCIONES = [
  { df: 0, dc: 1 },  // horizontal →
  { df: 1, dc: 0 },  // vertical ↓
  { df: 1, dc: 1 },  // diagonal ↘
  { df: -1, dc: 1 }  // diagonal ↗
];

function generarPuzzle(gridSize, numPalabras) {
  const candidatas = BANCO_PALABRAS.filter(p => p.length <= gridSize);
  const palabras = [...candidatas].sort(() => Math.random() - 0.5).slice(0, numPalabras);
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  function cabe(palabra, fila, col, dir) {
    for (let i = 0; i < palabra.length; i++) {
      const f = fila + dir.df * i;
      const c = col + dir.dc * i;
      if (f < 0 || f >= gridSize || c < 0 || c >= gridSize) return false;
      const actual = grid[f][c];
      if (actual != null && actual !== palabra[i]) return false;
    }
    return true;
  }

  function colocar(palabra) {
    const intentos = 60;
    for (let i = 0; i < intentos; i++) {
      const dir = DIRECCIONES[Math.floor(Math.random() * DIRECCIONES.length)];
      const fila = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (cabe(palabra, fila, col, dir)) {
        for (let k = 0; k < palabra.length; k++) {
          grid[fila + dir.df * k][col + dir.dc * k] = palabra[k];
        }
        return true;
      }
    }
    return false;
  }

  const colocadas = palabras.filter(colocar);

  for (let f = 0; f < gridSize; f++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[f][c] == null) grid[f][c] = ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
    }
  }

  return { grid, palabras: colocadas };
}

export default {
  id: 'sopa-de-letras',
  name: 'Sopa de Letras',
  category: 'atencion',
  skills: ['atencion', 'vision_periferica'],
  icon: '🔍',
  instructions: 'Encuentra todas las palabras escondidas en la cuadrícula antes de que se acabe el tiempo.',
  comoJugar: [
    'Toca la primera letra de una palabra y luego la última (en línea recta).',
    'La línea puede ir horizontal, vertical o en diagonal, en cualquier dirección.',
    'Si la línea forma una palabra de la lista, se marca como encontrada.',
    'Encuentra todas antes de que se acabe el cronómetro.'
  ],

  difficulty(level) {
    return {
      stages: 1,
      timeLimitSec: Math.max(70, 160 - level * 10),
      goal: 'time',
      params: {
        gridSize: Math.min(8, 6 + Math.floor((level - 1) / 3)),
        numPalabras: Math.min(6, 3 + Math.floor((level - 1) / 2))
      }
    };
  },

  mount(container, ctx) {
    const { gridSize, numPalabras } = ctx.config.params;
    const { grid, palabras } = generarPuzzle(gridSize, numPalabras);
    const pendientes = new Set(palabras);
    let inicio = null;
    let timer = null;
    let segundosRestantes = ctx.config.timeLimitSec;

    container.innerHTML = `
      <div class="pantalla" style="align-items:center;">
        <div style="display:flex; justify-content:space-between; width:100%; max-width:420px; margin-bottom: var(--esp-3);">
          <span class="eyebrow" id="sopa-restantes"></span>
          <span class="eyebrow" id="sopa-tiempo"></span>
        </div>
        <div id="sopa-grid" style="display:grid; grid-template-columns: repeat(${gridSize}, 1fr); gap: 2px; width: min(360px, 92vw); aspect-ratio: 1;"></div>
        <div id="sopa-lista" style="display:flex; gap: var(--esp-2); flex-wrap:wrap; justify-content:center; margin-top: var(--esp-4); max-width:420px;"></div>
      </div>
    `;

    const elGrid = container.querySelector('#sopa-grid');
    const elRestantes = container.querySelector('#sopa-restantes');
    const elTiempo = container.querySelector('#sopa-tiempo');
    const elLista = container.querySelector('#sopa-lista');

    const celdas = [];
    for (let f = 0; f < gridSize; f++) {
      for (let c = 0; c < gridSize; c++) {
        const celda = document.createElement('button');
        celda.textContent = grid[f][c];
        celda.dataset.f = f;
        celda.dataset.c = c;
        celda.style.aspectRatio = '1';
        celda.style.fontSize = gridSize > 7 ? 'var(--txt-sm)' : 'var(--txt-base)';
        celda.style.fontWeight = '700';
        celda.style.border = '1px solid var(--color-borde)';
        celda.style.borderRadius = 'var(--radio-sm)';
        celda.style.background = 'var(--color-superficie-2)';
        celda.style.color = 'var(--color-texto)';
        celda.style.cursor = 'pointer';
        elGrid.appendChild(celda);
        celdas.push(celda);
      }
    }

    function celdaEn(f, c) {
      return celdas[f * gridSize + c];
    }

    function actualizarLista() {
      elLista.innerHTML = palabras.map(p => `
        <span class="cat-chip cat-atencion" style="${pendientes.has(p) ? '' : 'opacity:0.4; text-decoration:line-through;'}">${p}</span>
      `).join('');
    }

    function actualizarHeader() {
      elRestantes.textContent = `${pendientes.size} por encontrar`;
      elTiempo.textContent = `⏱ ${segundosRestantes}s`;
    }

    function pintar(f, c, color) {
      celdaEn(f, c).style.background = color;
    }

    function limpiarSeleccion(soloVisual) {
      if (inicio && soloVisual) pintar(inicio.f, inicio.c, 'var(--color-superficie-2)');
      inicio = null;
    }

    function lineaEntre(a, b) {
      const df = b.f - a.f;
      const dc = b.c - a.c;
      const pasos = Math.max(Math.abs(df), Math.abs(dc));
      if (pasos === 0) return null;
      const esRecta = df === 0 || dc === 0 || Math.abs(df) === Math.abs(dc);
      if (!esRecta) return null;
      const signoF = Math.sign(df);
      const signoC = Math.sign(dc);
      const celdasLinea = [];
      for (let i = 0; i <= pasos; i++) {
        celdasLinea.push({ f: a.f + signoF * i, c: a.c + signoC * i });
      }
      return celdasLinea;
    }

    function terminar() {
      clearInterval(timer);
      ctx.finishStage();
      ctx.finishGame();
    }

    timer = setInterval(() => {
      segundosRestantes--;
      actualizarHeader();
      if (segundosRestantes <= 0) terminar();
    }, 1000);

    elGrid.addEventListener('click', (evento) => {
      const celda = evento.target.closest('button');
      if (!celda) return;
      const punto = { f: Number(celda.dataset.f), c: Number(celda.dataset.c) };

      if (!inicio) {
        inicio = punto;
        pintar(punto.f, punto.c, 'var(--color-primario)');
        return;
      }

      const linea = lineaEntre(inicio, punto);
      if (!linea) {
        limpiarSeleccion(true);
        return;
      }

      const letras = linea.map(p => grid[p.f][p.c]).join('');
      const palabraDirecta = letras;
      const palabraInvertida = letras.split('').reverse().join('');
      const encontrada = [...pendientes].find(p => p === palabraDirecta || p === palabraInvertida);

      if (encontrada) {
        linea.forEach(p => pintar(p.f, p.c, 'var(--color-exito)'));
        pendientes.delete(encontrada);
        ctx.reportAnswer(true);
        actualizarLista();
        actualizarHeader();
        inicio = null;
        if (pendientes.size === 0) terminar();
      } else {
        linea.forEach(p => pintar(p.f, p.c, 'var(--color-error)'));
        ctx.reportAnswer(false);
        setTimeout(() => {
          linea.forEach(p => pintar(p.f, p.c, 'var(--color-superficie-2)'));
        }, 300);
        inicio = null;
      }
    });

    ctx.onCleanup(() => clearInterval(timer));

    actualizarLista();
    actualizarHeader();
    ctx.startStage(1);
  }
};
