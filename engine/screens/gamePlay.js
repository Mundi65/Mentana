// Pantalla: gamePlay — contenedor donde corre el juego.
// Recibe { juegoId } por el router, carga el módulo y lo ejecuta con
// gameRunner. El container se entrega TAL CUAL al juego (contrato de
// SKILL.md): esta pantalla solo le agrega la flecha de "atrás" encima.
//
// IMPORTANTE: registra la función de limpieza del juego en el router
// (router.registrarLimpieza). Así, si el jugador sale a mitad de partida
// (botón atrás, o cualquier otra navegación), los temporizadores internos
// del juego se detienen de inmediato y no quedan corriendo en segundo
// plano "atrapando" la app en una pantalla inesperada más adelante.

import { cargarJuego } from '../games.js';
import { ejecutarJuego } from '../gameRunner.js';
import router from '../router.js';
import { montarBotonAtras } from '../botonAtras.js';

export default {
  async render(container, { juegoId, modoLibre = false }, token) {
    const juego = await cargarJuego(juegoId);
    if (!router.esVigente(token)) return; // el usuario ya navegó a otra pantalla mientras esto cargaba.

    const { detener } = ejecutarJuego(juego, container, {
      onFinish(resultado, logrosNuevos) {
        router.ir('gameResult', { juegoId, resultado, logrosNuevos, modoLibre });
      }
    });

    router.registrarLimpieza(detener);
    montarBotonAtras(container);
  }
};
