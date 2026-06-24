// =========================================================================
// MOTOR: games.js — único punto donde el motor "sabe" que /games existe.
// Carga un juego por su id, sin conocer nada de su contenido interno.
// =========================================================================

export async function cargarJuego(id) {
  const modulo = await import(`../games/${id}.js`);
  return modulo.default;
}
