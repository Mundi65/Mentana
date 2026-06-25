// =========================================================================
// MOTOR: router.js — navega entre pantallas, con historial para el botón
// "Atrás" y limpieza automática de la pantalla anterior (timers, etc.)
// para que nada quede corriendo en segundo plano al cambiar de pantalla.
// =========================================================================

const pantallas = {};
let actual = null;           // { nombre, params } de la pantalla visible
let pila = [];                // historial de pantallas anteriores
let limpiezaActual = null;    // función de limpieza de la pantalla visible (si registró una)
let tokenVigente = null;      // identifica la navegación más reciente (ver esVigente)

function ejecutarLimpieza() {
  if (limpiezaActual) {
    limpiezaActual();
    limpiezaActual = null;
  }
}

// Las pantallas con render(...) ASÍNCRONO (que esperan una carga antes de
// dibujar) reciben un "token" como tercer argumento. Si para cuando termina
// esa espera el usuario ya navegó a otro lado, router.esVigente(token) da
// false y la pantalla debe NO escribir su contenido — así una pantalla
// vieja y lenta nunca sobrescribe a la que el usuario está viendo ahora.
function montar(nombre, params) {
  const modulo = pantallas[nombre];
  if (!modulo) {
    console.error(`[router] Pantalla no registrada: "${nombre}"`);
    return;
  }
  ejecutarLimpieza();
  const contenedor = document.getElementById('app');
  contenedor.innerHTML = '';
  const token = Symbol(nombre);
  tokenVigente = token;
  actual = { nombre, params };
  modulo.render(contenedor, params, token);
}

export const router = {

  // Registra una pantalla por nombre. Se llama una vez por pantalla al iniciar la app.
  registrar(nombre, modulo) {
    pantallas[nombre] = modulo;
  },

  // Navega a una pantalla registrada, pasándole parámetros opcionales.
  // opciones.reemplazar = true: no guarda la pantalla actual en el historial
  // (úsalo para cambios entre pestañas o pasos de un flujo ya terminado,
  // donde "atrás" no debería volver a un paso intermedio).
  ir(nombre, params = {}, opciones = {}) {
    if (actual && !opciones.reemplazar) {
      pila.push(actual);
    }
    montar(nombre, params);
  },

  // Vuelve a la pantalla anterior del historial. Si no hay ninguna, no hace nada.
  atras() {
    if (pila.length === 0) return false;
    const anterior = pila.pop();
    montar(anterior.nombre, anterior.params);
    return true;
  },

  hayHistorial() {
    return pila.length > 0;
  },

  // La pantalla que se está mostrando ahora registra aquí su función de
  // limpieza (timers, listeners). El router la llama automáticamente
  // antes de mostrar cualquier otra pantalla (por ir() o por atras()).
  registrarLimpieza(fn) {
    limpiezaActual = fn;
  },

  // Una pantalla con carga asíncrona llama esto DESPUÉS de esperar (await)
  // y ANTES de escribir su contenido final. Si da false, no debe dibujar nada:
  // el usuario ya se fue a otra pantalla mientras esta estaba cargando.
  esVigente(token) {
    return token === tokenVigente;
  },

  actual() {
    return actual ? actual.nombre : null;
  }
};

export default router;
