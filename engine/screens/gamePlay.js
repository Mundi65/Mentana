// Pantalla: gamePlay — contenedor donde corre el juego.
// Recibe { juegoId } por el router, carga el módulo y lo ejecuta con
// gameRunner. El container se entrega TAL CUAL al juego (contrato de
// SKILL.md): esta pantalla no le agrega nada encima.

import { cargarJuego } from '../games.js';
import { ejecutarJuego } from '../gameRunner.js';
import router from '../router.js';

export default {
  async render(container, { juegoId }) {
    const juego = await cargarJuego(juegoId);

    ejecutarJuego(juego, container, {
      onFinish(resultado, logrosNuevos) {
        router.ir('gameResult', { juegoId, resultado, logrosNuevos });
      }
    });
  }
};
