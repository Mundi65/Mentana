// =========================================================================
// MOTOR: gameRunner.js — ejecuta UN juego usando el contrato fijo de
// .claude/skills/juego-cognitivo/SKILL.md. Construye el objeto `ctx` que
// recibe el juego, cuenta aciertos/errores, calcula el resultado final con
// scoring.js, guarda el progreso en el store y avisa cuándo termina.
// El juego nunca toca el store ni navega: solo dibuja y reporta por ctx.
// =========================================================================

import store from './store.js';
import appConfig from '../config/app.config.js';
import { calcularResultado } from './scoring.js';
import { evaluarLogros } from './achievements.js';

// Ejecuta juegoModulo dentro de container. opciones:
//   onStage(numero)    — se llama cuando empieza cada etapa.
//   onFinish(resultado, logrosNuevos) — se llama cuando termina la partida.
export function ejecutarJuego(juegoModulo, container, opciones = {}) {
  const idJuego = juegoModulo.id;
  const estado = store.obtener();
  const datosPrevios = estado.juegos[idJuego] || { nivel: 1, vecesJugado: 0, mejorPrecision: 0 };
  const nivel = datosPrevios.nivel || 1;
  const config = juegoModulo.difficulty(nivel);

  let correctas = 0;
  let incorrectas = 0;
  let terminado = false;
  const inicio = Date.now();
  const limpiezas = [];

  function limpiarTodo() {
    limpiezas.forEach((fn) => fn());
  }

  const ctx = {
    level: nivel,
    config,

    t(clave) {
      return appConfig.textos[clave] || clave;
    },

    startStage(numero) {
      if (opciones.onStage) opciones.onStage(numero);
    },

    reportAnswer(correcta) {
      if (correcta) correctas++; else incorrectas++;
    },

    finishStage() {
      if (opciones.onStageEnd) opciones.onStageEnd();
    },

    finishGame() {
      if (terminado) return;
      terminado = true;

      const tiempoSegundos = Math.round((Date.now() - inicio) / 1000);
      const resultado = calcularResultado({ correctas, incorrectas, tiempoSegundos, config });

      store.actualizar((s) => {
        const datos = s.juegos[idJuego] || { nivel: 1, vecesJugado: 0, mejorPrecision: 0 };
        datos.vecesJugado += 1;
        datos.mejorPrecision = Math.max(datos.mejorPrecision || 0, resultado.precision);
        datos.ultimaPrecision = resultado.precision;
        if (resultado.subeNivel) datos.nivel = (datos.nivel || 1) + 1;
        s.juegos[idJuego] = datos;

        s.progreso.historial.push({
          fecha: new Date().toISOString().slice(0, 10),
          juegoId: idJuego,
          puntuacion: resultado.puntuacion,
          precision: resultado.precision
        });
        return s;
      });

      const logrosNuevos = evaluarLogros({ precisionJuego: resultado.precision });

      limpiarTodo();
      if (opciones.onFinish) opciones.onFinish(resultado, logrosNuevos);
    },

    onCleanup(fn) {
      limpiezas.push(fn);
    },

    timeLeftSec() {
      if (config.timeLimitSec == null) return null;
      const transcurrido = Math.round((Date.now() - inicio) / 1000);
      return Math.max(0, config.timeLimitSec - transcurrido);
    }
  };

  juegoModulo.mount(container, ctx);

  return { detener: limpiarTodo };
}
