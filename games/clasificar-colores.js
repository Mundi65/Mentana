// /games/clasificar-colores.js — categoría: logica
// Clásico popular de internet (sort de colores en tubos), hecho a la cara
// de MENTANA. Cada tubo de ensayo es una columna; viertes el color de
// arriba de un tubo en otro hasta que cada tubo quede de un solo color.
// Entrena planificación y memoria de trabajo (recordar dónde está cada
// color mientras decides el siguiente paso).
//
// Generación SIEMPRE resoluble: se arma el rompecabezas ya resuelto y se
// "desordena" aplicando movimientos válidos (la operación inversa de un
// movimiento válido es también un movimiento válido), así nunca se genera
// un tablero imposible.

const COLORES = ['--cat-atencion', '--cat-memoria', '--cat-calculo', '--cat-velocidad', '--cat-logica'];

function contarRunSuperior(tubo) {
  if (tubo.length === 0) return 0;
  const color = tubo[tubo.length - 1];
  let n = 0;
  for (let i = tubo.length - 1; i >= 0 && tubo[i] === color; i--) n++;
  return n;
}

function puedeVerter(origen, destino, capacidad) {
  if (origen.length === 0) return false;
  if (destino.length >= capacidad) return false;
  if (destino.length > 0 && destino[destino.length - 1] !== origen[origen.length - 1]) return false;
  return true;
}

function verter(origen, destino, capacidad, soloUno) {
  const cuantos = soloUno ? 1 : Math.min(contarRunSuperior(origen), capacidad - destino.length);
  for (let i = 0; i < cuantos; i++) destino.push(origen.pop());
}

function generarPuzzle(numColores, tubosVacios, capacidad, movimientosMezcla) {
  const tubos = [];
  for (let c = 0; c < numColores; c++) {
    tubos.push(Array.from({ length: capacidad }, () => COLORES[c]));
  }
  for (let v = 0; v < tubosVacios; v++) tubos.push([]);

  let aplicados = 0;
  let intentos = movimientosMezcla * 8;
  while (aplicados < movimientosMezcla && intentos > 0) {
    intentos--;
    const a = Math.floor(Math.random() * tubos.length);
    const b = Math.floor(Math.random() * tubos.length);
    if (a === b) continue;
    if (puedeVerter(tubos[a], tubos[b], capacidad)) {
      verter(tubos[a], tubos[b], capacidad, true);
      aplicados++;
    }
  }
  return tubos;
}

function estaResuelto(tubo, capacidad) {
  if (tubo.length === 0) return true;
  if (tubo.length !== capacidad) return false;
  return tubo.every(c => c === tubo[0]);
}

// Ancho/alto del tubo de ensayo (chico, a propósito).
const ANCHO_TUBO = 38;
const ALTO_SEGMENTO = 22;

export default {
  id: 'clasificar-colores',
  name: 'Clasificar Colores',
  category: 'logica',
  skills: ['resolucion_problemas', 'memoria_trabajo'],
  icon: '🧪',
  instructions: 'Vierte el color de arriba de un tubo en otro hasta que cada tubo quede de un solo color.',
  comoJugar: [
    'Toca un tubo para elegirlo como origen (se resalta).',
    'Toca otro tubo para verter ahí el color de arriba.',
    'Solo puedes verter sobre un tubo vacío o que tenga el mismo color arriba.',
    'Ganas cuando cada tubo queda de un solo color (o vacío).'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        numColores: Math.min(5, 3 + Math.floor((level - 1) / 2)),
        tubosVacios: 2,
        capacidad: 4,
        movimientosMezcla: 12 + level * 2
      }
    };
  },

  mount(container, ctx) {
    const { numColores, tubosVacios, capacidad, movimientosMezcla } = ctx.config.params;
    let stage = 1;
    let tubos = [];
    let origenSeleccionado = null;
    let animando = false;
    const timers = [];

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="eyebrow" id="colores-etapa" style="margin-bottom: var(--esp-5);"></div>
        <div id="colores-tubos" style="display:flex; gap: var(--esp-3); flex-wrap:wrap; justify-content:center; max-width: 480px; align-items:flex-end;"></div>
        <p id="colores-mensaje" style="color: var(--color-texto-tenue); margin-top: var(--esp-5); min-height: 1.2em;"></p>
      </div>
    `;

    const elTubos = container.querySelector('#colores-tubos');
    const elEtapa = container.querySelector('#colores-etapa');
    const elMensaje = container.querySelector('#colores-mensaje');

    function segmentoLiquido(color) {
      return `<div style="
        width:100%; height:${ALTO_SEGMENTO}px; flex-shrink:0;
        background: linear-gradient(180deg, color-mix(in srgb, var(${color}) 70%, white) 0%, var(${color}) 35%, var(${color}) 100%);
        border-radius: 2px;
      "></div>`;
    }

    function dibujarTubos() {
      elTubos.innerHTML = tubos.map((tubo, indice) => {
        const segmentos = tubo.map(segmentoLiquido).join('');
        const seleccionado = indice === origenSeleccionado;
        const altoTubo = capacidad * ALTO_SEGMENTO + 10;
        return `
          <button data-indice="${indice}" class="tubo-ensayo" style="
            width: ${ANCHO_TUBO}px; height: ${altoTubo}px; display:flex; flex-direction:column-reverse; gap:2px;
            padding: 4px; cursor:pointer; box-sizing:border-box;
            background: color-mix(in srgb, var(--color-superficie-2) 60%, transparent);
            border: 2px solid ${seleccionado ? 'var(--color-filo)' : 'var(--color-borde)'};
          ">${segmentos}</button>
        `;
      }).join('');
    }

    function tuboEl(indice) {
      return elTubos.querySelector(`button[data-indice="${indice}"]`);
    }

    function intentarMovimiento(destinoIndice) {
      const origenIndice = origenSeleccionado;
      const origen = tubos[origenIndice];
      const destino = tubos[destinoIndice];
      const valido = origenIndice !== destinoIndice && puedeVerter(origen, destino, capacidad);

      ctx.reportAnswer(valido);
      origenSeleccionado = null;

      if (!valido) {
        elMensaje.textContent = 'No se puede verter ahí.';
        dibujarTubos();
        return;
      }

      elMensaje.textContent = '';
      animando = true;
      elTubos.style.pointerEvents = 'none';

      const elOrigen = tuboEl(origenIndice);
      const claseInclinar = destinoIndice > origenIndice ? 'tubo-inclinar-der' : 'tubo-inclinar-izq';
      if (elOrigen) elOrigen.classList.add(claseInclinar);

      timers.push(setTimeout(() => {
        verter(origen, destino, capacidad, false);
        dibujarTubos();
        const elDestino = tuboEl(destinoIndice);
        if (elDestino) elDestino.classList.add('tubo-pulso');
        elTubos.style.pointerEvents = '';
        animando = false;

        if (tubos.every(t => estaResuelto(t, capacidad))) {
          elMensaje.textContent = '¡Resuelto!';
          timers.push(setTimeout(terminarEtapa, 600));
        }
      }, 350));
    }

    elTubos.addEventListener('click', (evento) => {
      if (animando) return;
      const boton = evento.target.closest('button');
      if (!boton) return;
      const indice = Number(boton.dataset.indice);

      if (origenSeleccionado === null) {
        if (tubos[indice].length === 0) return; // no tiene sentido elegir un tubo vacío como origen.
        origenSeleccionado = indice;
        dibujarTubos();
      } else if (indice === origenSeleccionado) {
        origenSeleccionado = null;
        dibujarTubos();
      } else {
        intentarMovimiento(indice);
      }
    });

    function correrEtapa() {
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages}`;
      elMensaje.textContent = '';
      origenSeleccionado = null;
      tubos = generarPuzzle(numColores, tubosVacios, capacidad, movimientosMezcla);
      dibujarTubos();
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

    ctx.onCleanup(() => timers.forEach(clearTimeout));

    ctx.startStage(stage);
    correrEtapa();
  }
};
