// /games/un-trazo.js — categoría: logica
// Clásico de lógica (camino euleriano / "dibuja sin levantar el lápiz"):
// hay puntos conectados por líneas; debes dibujar TODAS las líneas en un
// solo recorrido continuo, sin repetir ninguna. Entrena planificación
// (decidir el orden correcto) y flexibilidad cognitiva.
//
// Generación SIEMPRE resoluble: se construye el rompecabezas CAMINANDO un
// recorrido válido al azar (nodo por nodo); las líneas del puzzle son
// exactamente las que se usaron en ese recorrido, así siempre existe al
// menos una forma de dibujarlas todas sin repetir.

function claveArista(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function generarTrazo(numNodos, objetivoAristas) {
  let actual = Math.floor(Math.random() * numNodos);
  const usadas = new Set();
  const maxPosibles = (numNodos * (numNodos - 1)) / 2;
  const objetivo = Math.min(objetivoAristas, maxPosibles);

  while (usadas.size < objetivo) {
    const candidatos = [];
    for (let n = 0; n < numNodos; n++) {
      if (n === actual) continue;
      if (!usadas.has(claveArista(actual, n))) candidatos.push(n);
    }
    if (candidatos.length === 0) break; // no quedan aristas nuevas desde aquí: el trazo termina.
    const siguiente = candidatos[Math.floor(Math.random() * candidatos.length)];
    usadas.add(claveArista(actual, siguiente));
    actual = siguiente;
  }
  return usadas;
}

function posicionNodo(i, n) {
  const angulo = -Math.PI / 2 + i * ((2 * Math.PI) / n);
  return { x: 50 + 38 * Math.cos(angulo), y: 50 + 38 * Math.sin(angulo) };
}

export default {
  id: 'un-trazo',
  name: 'Un Solo Trazo',
  category: 'logica',
  skills: ['flexibilidad_cognitiva', 'resolucion_problemas'],
  icon: '✏️',
  instructions: 'Dibuja TODAS las líneas sin levantar el dedo y sin repetir ninguna.',
  comoJugar: [
    'Toca un punto para empezar.',
    'Toca otro punto conectado por una línea para dibujarla.',
    'No puedes repetir una línea ya dibujada (pero sí puedes pasar otra vez por un punto).',
    'Ganas cuando todas las líneas quedan dibujadas.'
  ],

  difficulty(level) {
    return {
      stages: 3,
      timeLimitSec: null,
      goal: 'flawless',
      params: {
        numNodos: Math.min(8, 5 + Math.floor((level - 1) / 3)),
        objetivoAristas: Math.min(12, 6 + level)
      }
    };
  },

  mount(container, ctx) {
    const { numNodos, objetivoAristas } = ctx.config.params;
    let stage = 1;
    let setAristas = new Set();
    let aristasUsadas = new Set();
    let nodoActual = null;
    const posiciones = Array.from({ length: numNodos }, (_, i) => posicionNodo(i, numNodos));

    container.innerHTML = `
      <div class="pantalla" style="align-items:center; justify-content:center;">
        <div class="eyebrow" id="trazo-etapa" style="margin-bottom: var(--esp-5);"></div>
        <div id="trazo-lienzo" style="position:relative; width: min(320px, 85vw); aspect-ratio:1;">
          <svg viewBox="0 0 100 100" style="position:absolute; inset:0; width:100%; height:100%;"></svg>
        </div>
        <p id="trazo-mensaje" style="color: var(--color-texto-tenue); margin-top: var(--esp-5); min-height: 1.2em;"></p>
      </div>
    `;

    const elLienzo = container.querySelector('#trazo-lienzo');
    const elSvg = elLienzo.querySelector('svg');
    const elEtapa = container.querySelector('#trazo-etapa');
    const elMensaje = container.querySelector('#trazo-mensaje');

    function dibujar() {
      const lineasHTML = Array.from(setAristas).map((clave) => {
        const [a, b] = clave.split('-').map(Number);
        const dibujada = aristasUsadas.has(clave);
        return `<line x1="${posiciones[a].x}" y1="${posiciones[a].y}" x2="${posiciones[b].x}" y2="${posiciones[b].y}"
          stroke="${dibujada ? 'var(--color-filo)' : 'var(--color-borde)'}"
          stroke-width="${dibujada ? 2.5 : 1.2}" stroke-linecap="round" />`;
      }).join('');
      elSvg.innerHTML = lineasHTML;

      const botonesViejos = elLienzo.querySelectorAll('button');
      botonesViejos.forEach(b => b.remove());

      posiciones.forEach((p, i) => {
        const esActual = i === nodoActual;
        const boton = document.createElement('button');
        boton.dataset.indice = i;
        boton.style.position = 'absolute';
        boton.style.left = `calc(${p.x}% - 14px)`;
        boton.style.top = `calc(${p.y}% - 14px)`;
        boton.style.width = '28px';
        boton.style.height = '28px';
        boton.style.borderRadius = '50%';
        boton.style.cursor = 'pointer';
        boton.style.border = esActual ? '3px solid var(--color-filo)' : '2px solid var(--color-borde)';
        boton.style.background = esActual ? 'var(--cat-logica)' : 'var(--color-superficie-2)';
        elLienzo.appendChild(boton);
      });
    }

    function comprobarVictoria() {
      if (aristasUsadas.size === setAristas.size) {
        elMensaje.textContent = '¡Resuelto!';
        setTimeout(terminarEtapa, 500);
      }
    }

    elLienzo.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button');
      if (!boton) return;
      const i = Number(boton.dataset.indice);

      if (nodoActual === null) {
        nodoActual = i;
        dibujar();
        return;
      }
      if (i === nodoActual) {
        // Tocar el punto actual de nuevo: reinicia todo el trazo desde cero.
        aristasUsadas = new Set();
        nodoActual = null;
        elMensaje.textContent = '';
        dibujar();
        return;
      }

      const clave = claveArista(nodoActual, i);
      const valido = setAristas.has(clave) && !aristasUsadas.has(clave);
      ctx.reportAnswer(valido);

      if (valido) {
        aristasUsadas.add(clave);
        nodoActual = i;
        elMensaje.textContent = '';
        dibujar();
        comprobarVictoria();
      } else {
        elMensaje.textContent = 'Ahí no se puede.';
      }
    });

    function correrEtapa() {
      elEtapa.textContent = `Etapa ${stage} de ${ctx.config.stages}`;
      elMensaje.textContent = '';
      nodoActual = null;
      aristasUsadas = new Set();
      setAristas = generarTrazo(numNodos, objetivoAristas);
      dibujar();
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
