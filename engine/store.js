// =========================================================================
// MOTOR: store.js — TODO lo que se guarda en localStorage.
// Una sola "caja" con todos los datos del usuario en este dispositivo:
// perfil/encuesta, suscripción/prueba, puntuaciones, racha, progreso y logros.
// Nadie en /games ni en las pantallas debe tocar localStorage directamente:
// siempre a través de las funciones de este archivo.
// =========================================================================

const CLAVE = 'mentana_store_v1';

function estadoVacio() {
  return {
    onboardingCompleto: false,
    respuestasEncuesta: {},   // { pais, rangoEdad, objetivos: [], autoNivel, ... }
    paisISO: null,            // respaldo de geo.js (Fase 2)
    suscripcion: {
      activa: false,
      plan: null,             // id del plan ('mensual' | 'anual')
      desde: null
    },
    prueba: {
      inicio: null,           // fecha ISO en que empezó la prueba gratis
      diasTotales: null
    },
    juegos: {
      // por id de juego: { nivel, vecesJugado, mejorPrecision, ultimaPrecision }
    },
    sesionDiaria: null, // { fecha, juegosId: [], indiceActual, completada }
    racha: {
      actual: 0,
      mejor: 0,
      ultimoDiaEntrenado: null // fecha ISO (solo día) del último entrenamiento
    },
    sesiones: {
      completadas: 0
    },
    logrosDesbloqueados: [], // lista de ids de logros
    progreso: {
      historial: [] // [{ fecha, juegoId, puntuacion, precision }]
    }
  };
}

function leer() {
  const crudo = localStorage.getItem(CLAVE);
  if (!crudo) return estadoVacio();
  try {
    return { ...estadoVacio(), ...JSON.parse(crudo) };
  } catch {
    return estadoVacio();
  }
}

function guardar(estado) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
}

// ---- API pública del store ----

export const store = {

  obtener() {
    return leer();
  },

  // Reemplaza el estado completo (uso interno / pruebas).
  reemplazar(estadoNuevo) {
    guardar(estadoNuevo);
  },

  // Aplica una función de actualización parcial y guarda el resultado.
  // uso: store.actualizar(s => { s.racha.actual++; return s; })
  actualizar(fnActualizar) {
    const estado = leer();
    const nuevo = fnActualizar(estado) || estado;
    guardar(nuevo);
    return nuevo;
  },

  borrarTodo() {
    localStorage.removeItem(CLAVE);
  }
};

export default store;
