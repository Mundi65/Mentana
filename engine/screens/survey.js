// Pantalla: survey — encuesta de onboarding.
// Muestra una pregunta a la vez (vienen de /config/app.config.js). Guarda
// cada respuesta en memoria local de esta pantalla y, al terminar la última
// pregunta, guarda TODO de una vez en el store y avanza al resumen.

import appConfig from '../../config/app.config.js';
import store from '../store.js';
import onboarding from '../onboarding.js';

// Saca el texto visible de una opción (puede ser string o {label, valor}).
function etiquetaDe(opcion) {
  return typeof opcion === 'object' ? opcion.label : opcion;
}

// Saca el valor real a guardar de una opción (puede ser string o {label, valor}).
function valorDe(opcion) {
  return typeof opcion === 'object' ? opcion.valor : opcion;
}

export default {
  render(container) {
    const preguntas = appConfig.encuesta;
    let indice = 0;
    const respuestas = {}; // { guarda: valor }

    function preguntaActual() {
      return preguntas[indice];
    }

    function puedeAvanzar() {
      const p = preguntaActual();
      if (p.opcional) return true;
      const r = respuestas[p.guarda];
      if (p.tipo === 'multi') return Array.isArray(r) && r.length > 0;
      return r !== undefined && r !== null && r !== '';
    }

    function dibujar() {
      const p = preguntaActual();
      const progreso = Math.round(((indice) / preguntas.length) * 100);

      const opcionesHTML = p.opciones.map((op, i) => {
        const etiqueta = etiquetaDe(op);
        const valor = valorDe(op);
        const tipoInput = p.tipo === 'multi' ? 'checkbox' : 'radio';
        const marcado = p.tipo === 'multi'
          ? (Array.isArray(respuestas[p.guarda]) && respuestas[p.guarda].includes(valor))
          : (respuestas[p.guarda] === valor);
        return `
          <label class="tarjeta" style="display:flex; align-items:center; gap: var(--esp-3); margin-bottom: var(--esp-2); cursor:pointer; padding: var(--esp-3) var(--esp-4);">
            <input type="${tipoInput}" name="opcion" data-valor='${JSON.stringify(valor)}' ${marcado ? 'checked' : ''} style="width:18px; height:18px;">
            <span>${etiqueta}</span>
          </label>
        `;
      }).join('');

      container.innerHTML = `
        <div class="pantalla" style="display:flex; flex-direction:column; padding: var(--esp-5); max-width:420px; margin:auto;">
          <div style="background: var(--color-superficie-2); border-radius: var(--radio-pastilla); height:6px; overflow:hidden; margin-bottom: var(--esp-5);">
            <div style="background: var(--color-primario); height:100%; width:${progreso}%; transition: width var(--trans-media);"></div>
          </div>
          <h2 class="display" style="font-size: var(--txt-xl); margin-bottom: var(--esp-5);">${p.texto}</h2>
          <div id="opciones">${opcionesHTML}</div>
          <div style="margin-top:auto; display:flex; flex-direction:column; gap: var(--esp-3); padding-top: var(--esp-5);">
            ${p.opcional ? `<button id="btn-omitir" class="boton boton--fantasma">Omitir</button>` : ''}
            <button id="btn-siguiente" class="boton boton--filo">${appConfig.textos.botonContinuar}</button>
          </div>
        </div>
      `;

      container.querySelectorAll('input[name="opcion"]').forEach((input) => {
        input.addEventListener('change', () => {
          const valor = JSON.parse(input.dataset.valor);
          if (p.tipo === 'multi') {
            const actual = Array.isArray(respuestas[p.guarda]) ? respuestas[p.guarda] : [];
            if (input.checked) {
              respuestas[p.guarda] = [...actual, valor];
            } else {
              respuestas[p.guarda] = actual.filter(v => JSON.stringify(v) !== JSON.stringify(valor));
            }
          } else {
            respuestas[p.guarda] = valor;
          }
        });
      });

      const btnSiguiente = container.querySelector('#btn-siguiente');
      btnSiguiente.addEventListener('click', avanzar);

      const btnOmitir = container.querySelector('#btn-omitir');
      if (btnOmitir) btnOmitir.addEventListener('click', () => {
        delete respuestas[p.guarda];
        avanzar();
      });
    }

    function avanzar() {
      if (!puedeAvanzar()) return;
      if (indice < preguntas.length - 1) {
        indice++;
        dibujar();
      } else {
        terminar();
      }
    }

    function terminar() {
      store.actualizar((s) => {
        s.respuestasEncuesta = { ...s.respuestasEncuesta, ...respuestas };
        return s;
      });
      onboarding.irASummary();
    }

    dibujar();
  }
};
