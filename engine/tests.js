// =========================================================================
// MOTOR: tests.js — único punto donde el motor "sabe" que /tests existe.
// Carga un test por su id, sin conocer nada de su contenido interno.
// Es el equivalente de games.js pero para tests (contenido distinto: un
// test da un PERFIL de resultado, no precisión ni nivel).
// =========================================================================

export async function cargarTest(id) {
  const modulo = await import(`../tests/${id}.js`);
  return modulo.default;
}

// A partir de las respuestas (lista de claves de perfil elegidas, una por
// pregunta), decide el perfil ganador: el que más veces se eligió.
export function calcularPerfilGanador(test, clavesElegidas) {
  const conteo = {};
  for (const clave of clavesElegidas) {
    conteo[clave] = (conteo[clave] || 0) + 1;
  }
  let mejorClave = null;
  let mejorConteo = -1;
  for (const [clave, cuenta] of Object.entries(conteo)) {
    if (cuenta > mejorConteo) {
      mejorConteo = cuenta;
      mejorClave = clave;
    }
  }
  return { clave: mejorClave, ...test.perfiles[mejorClave] };
}
