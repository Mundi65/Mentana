// /games/crucigrama.js — categoría: logica
// Crucigrama clásico hecho a la cara de MENTANA. Como no hay teclado en
// pantalla, cada pista se resuelve tocando sus letras DESORDENADAS en el
// orden correcto; al armar la palabra bien, se completa en la cuadrícula
// cruzada. Entrena vocabulario, memoria de trabajo y razonamiento.
//
// Generación SIEMPRE resoluble: cada palabra se coloca solo si encaja sin
// conflicto con lo ya puesto (cruzando una letra en común); si una palabra
// del banco no encuentra dónde cruzar, simplemente se descarta de esa
// ronda — el tablero final solo contiene palabras realmente colocadas.

const BANCO = [
  { palabra: 'FOCO', pista: 'Punto de atención concentrada.' },
  { palabra: 'CALMA', pista: 'Estado de tranquilidad mental.' },
  { palabra: 'MENTE', pista: 'Donde ocurren los pensamientos.' },
  { palabra: 'LOGICA', pista: 'Razonamiento ordenado y coherente.' },
  { palabra: 'MEMORIA', pista: 'Capacidad de recordar información.' },
  { palabra: 'AGUDEZA', pista: 'Capacidad de percibir con precisión.' },
  { palabra: 'ENFOQUE', pista: 'Dirigir la atención hacia algo.' },
  { palabra: 'CEREBRO', pista: 'Órgano que controla el pensamiento.' },
  { palabra: 'ATENCION', pista: 'Capacidad de concentrarse en un estímulo.' },
  { palabra: 'CLARIDAD', pista: 'Cualidad de ser fácil de entender.' }
];

function intentarColocar(grid, palabra, esPrimera) {
  if (esPrimera) {
    for (let i = 0; i < palabra.length; i++) grid.set(`0,${i}`, { letra: palabra[i], horizontal: true });
    return { fila: 0, col: 0, horizontal: true };
  }
  for (let i = 0; i < palabra.length; i++) {
    const letra = palabra[i];
    for (const [clave, val] of grid) {
      if (val.letra !== letra) continue;
      const [f, c] = clave.split(',').map(Number);
      const nuevaHorizontal = !val.horizontal;
      const fila = nuevaHorizontal ? f : f - i;
      const col = nuevaHorizontal ? c - i : c;
      let ok = true;
      for (let k = 0; k < palabra.length && ok; k++) {
        const ff = nuevaHorizontal ? fila : fila + k;
        const cc = nuevaHorizontal ? col + k : col;
        const existente = grid.get(`${ff},${cc}`);
        if (existente && existente.letra !== palabra[k]) ok = false;
      }
      if (ok) {
        for (let k = 0; k < palabra.length; k++) {
          const ff = nuevaHorizontal ? fila : fila + k;
          const cc = nuevaHorizontal ? col + k : col;
          grid.set(`${ff},${cc}`, { letra: palabra[k], horizontal: nuevaHorizontal });
        }
        return { fila, col, horizontal: nuevaHorizontal };
      }
    }
  }
  return null;
}

function generarCrucigrama(numPalabras) {
  const candidatas = [...BANCO].sort(() => Math.random() - 0.5);
  const grid = new Map();
  const colocadas = [];
  for (const item of candidatas) {
    if (colocadas.length >= numPalabras) break;
    const resultado = intentarColocar(grid, item.palabra, colocadas.length === 0);
    if (resultado) colocadas.push({ ...item, ...resultado });
  }
  colocadas.sort((a, b) => (a.fila - b.fila) || (a.col - b.col));
  colocadas.forEach((p, i) => { p.numero = i + 1; });
  return colocadas;
}

function celdasDePalabra(p) {
  return Array.from({ length: p.palabra.length }, (_, k) => ({
    fila: p.horizontal ? p.fila : p.fila + k,
    col: p.horizontal ? p.col + k : p.col
  }));
}

function mezclar(letras) {
  const arreglo = letras.split('');
  for (let i = arreglo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
  }
  return arreglo;
}

export default {
  id: 'crucigrama',
  name: 'Crucigrama',
  category: 'logica',
  skills: ['resolucion_problemas', 'memoria_trabajo'],
  icon: '🔠',
  instructions: 'Resuelve cada pista armando la palabra con las letras desordenadas.',
  comoJugar: [
    'Toca una pista de la lista.',
    'Toca las letras desordenadas en el orden correcto para armar la palabra.',
    'Si la palabra es correcta, se completa en el tablero.',
    'Resuelve todas las pistas para terminar la ronda.'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: { numPalabras: Math.min(5, 3 + Math.floor((level - 1) / 2)) }
    };
  },

  mount(container, ctx) {
    const { numPalabras } = ctx.config.params;
    let stage = 1;
    let palabras = [];
    let pistaActiva = null;
    let letrasElegidas = [];

    container.innerHTML = `
      <div class="pantalla" style="align-items:center;">
        <div class="eyebrow" id="cruci-etapa" style="margin-bottom: var(--esp-4);"></div>
        <div id="cruci-grid" style="display:grid; gap:3px; margin-bottom: var(--esp-5);"></div>
        <div id="cruci-pistas" style="width:100%; max-width:380px;"></div>
        <div id="cruci-letras" style="display:flex; gap: var(--esp-2); justify-content:center; flex-wrap:wrap; margin-top: var(--esp-4);"></div>
        <p id="cruci-mensaje" style="color: var(--color-texto-tenue); margin-top: var(--esp-4); min-height: 1.2em;"></p>
      </div>
    `;

    const elGrid = container.querySelector('#cruci-grid');
    const elPistas = container.querySelector('#cruci-pistas');
    const elLetras = container.querySelector('#cruci-letras');
    const elEtapa = container.querySelector('#cruci-etapa');
    const elMensaje = container.querySelector('#cruci-mensaje');

    function limites() {
      let minF = 0, maxF = 0, minC = 0, maxC = 0;
      palabras.forEach(p => {
        celdasDePalabra(p).forEach(({ fila, col }) => {
          minF = Math.min(minF, fila); maxF = Math.max(maxF, fila);
          minC = Math.min(minC, col); maxC = Math.max(maxC, col);
        });
      });
      return { minF, maxF, minC, maxC };
    }

    function dibujarGrid() {
      const { minF, maxF, minC, maxC } = limites();
      const filas = maxF - minF + 1;
      const cols = maxC - minC + 1;
      const mapaCeldas = new Map();
      palabras.forEach(p => {
        celdasDePalabra(p).forEach(({ fila, col }, i) => {
          const clave = `${fila},${col}`;
          if (!mapaCeldas.has(clave)) mapaCeldas.set(clave, { letra: null, numero: i === 0 ? p.numero : null });
        });
        if (p.resuelta) {
          celdasDePalabra(p).forEach(({ fila, col }, i) => {
            mapaCeldas.get(`${fila},${col}`).letra = p.palabra[i];
          });
        }
      });

      const tamCelda = cols > 7 ? 32 : 38;
      elGrid.style.gridTemplateColumns = `repeat(${cols}, ${tamCelda}px)`;

      let html = '';
      for (let f = minF; f <= maxF; f++) {
        for (let c = minC; c <= maxC; c++) {
          const dato = mapaCeldas.get(`${f},${c}`);
          if (!dato) {
            html += `<div style="width:${tamCelda}px; height:${tamCelda}px;"></div>`;
          } else {
            html += `<div style="
              width:${tamCelda}px; height:${tamCelda}px; position:relative;
              display:flex; align-items:center; justify-content:center;
              background: ${dato.letra ? 'var(--color-exito)' : 'var(--color-superficie-2)'};
              border-radius: 4px; border:1px solid var(--color-borde);
              font-weight:700; color: var(--color-texto-sobre-primario);
            ">
              ${dato.numero ? `<span style="position:absolute; top:1px; left:2px; font-size:8px; color: var(--color-texto-tenue);">${dato.numero}</span>` : ''}
              ${dato.letra || ''}
            </div>`;
          }
        }
      }
      elGrid.innerHTML = html;
    }

    function dibujarPistas() {
      elPistas.innerHTML = palabras.map(p => `
        <div class="fila-tarjeta" data-numero="${p.numero}" style="${p.resuelta ? 'opacity:0.5;' : ''}">
          <div class="fila-icono" style="font-size:1rem;">${p.resuelta ? '✓' : p.numero}</div>
          <div style="text-align:left;">${p.pista}</div>
        </div>
      `).join('');
    }

    function dibujarLetras() {
      if (pistaActiva === null) { elLetras.innerHTML = ''; return; }
      const p = palabras.find(x => x.numero === pistaActiva);
      elLetras.innerHTML = `
        <div style="width:100%; text-align:center; color: var(--color-texto-tenue); margin-bottom: var(--esp-2);">${letrasElegidas.join('')}</div>
        ${p._letrasMezcladas.map((letra, i) => `
          <button data-indice="${i}" class="boton boton--primario" style="width:44px; height:44px; padding:0; ${p._usadas[i] ? 'opacity:0.3;' : ''}">${letra}</button>
        `).join('')}
      `;
    }

    function comprobarFinRonda() {
      if (palabras.every(p => p.resuelta)) {
        elMensaje.textContent = '¡Ronda completa!';
        setTimeout(terminarEtapa, 600);
      }
    }

    elPistas.addEventListener('click', (evento) => {
      const fila = evento.target.closest('.fila-tarjeta');
      if (!fila) return;
      const numero = Number(fila.dataset.numero);
      const p = palabras.find(x => x.numero === numero);
      if (p.resuelta) return;
      pistaActiva = numero;
      letrasElegidas = [];
      p._letrasMezcladas = mezclar(p.palabra);
      p._usadas = p._letrasMezcladas.map(() => false);
      elMensaje.textContent = '';
      dibujarLetras();
    });

    elLetras.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton) return;
      const p = palabras.find(x => x.numero === pistaActiva);
      const i = Number(boton.dataset.indice);
      if (p._usadas[i]) return;

      p._usadas[i] = true;
      letrasElegidas.push(p._letrasMezcladas[i]);
      dibujarLetras();

      if (letrasElegidas.length === p.palabra.length) {
        const intento = letrasElegidas.join('');
        const correcto = intento === p.palabra;
        ctx.reportAnswer(correcto);

        if (correcto) {
          p.resuelta = true;
          pistaActiva = null;
          elMensaje.textContent = '';
          dibujarGrid();
          dibujarPistas();
          dibujarLetras();
          comprobarFinRonda();
        } else {
          elMensaje.textContent = 'Esa no es la palabra. Intenta de nuevo.';
          letrasElegidas = [];
          p._usadas = p._letrasMezcladas.map(() => false);
          dibujarLetras();
        }
      }
    });

    function correrEtapa() {
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages}`;
      elMensaje.textContent = '';
      pistaActiva = null;
      letrasElegidas = [];
      palabras = generarCrucigrama(numPalabras);
      dibujarGrid();
      dibujarPistas();
      dibujarLetras();
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
