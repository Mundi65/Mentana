// =========================================================================
// MOTOR: router.js — navega entre pantallas.
// Cada pantalla es un módulo con una función render(container, params).
// El router solo limpia el contenedor #app y llama a la pantalla pedida.
// No sabe nada de onboarding, juegos ni reglas: solo "ir a esta pantalla".
// =========================================================================

const pantallas = {};
let pantallaActual = null;

export const router = {

  // Registra una pantalla por nombre. Se llama una vez por pantalla al iniciar la app.
  registrar(nombre, modulo) {
    pantallas[nombre] = modulo;
  },

  // Navega a una pantalla registrada, pasándole parámetros opcionales.
  ir(nombre, params = {}) {
    const modulo = pantallas[nombre];
    if (!modulo) {
      console.error(`[router] Pantalla no registrada: "${nombre}"`);
      return;
    }
    const contenedor = document.getElementById('app');
    contenedor.innerHTML = '';
    pantallaActual = nombre;
    modulo.render(contenedor, params);
  },

  actual() {
    return pantallaActual;
  }
};

export default router;
