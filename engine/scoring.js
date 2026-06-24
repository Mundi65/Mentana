// =========================================================================
// MOTOR: scoring.js — puntos, precisión y subida de nivel.
// Los juegos NO calculan nada de esto: solo reportan respuestas (true/false)
// vía ctx.reportAnswer(...). El motor (gameRunner.js, en el Paso 5) usa estas
// funciones para convertir esas respuestas en resultado final.
// =========================================================================

// Calcula la precisión (% de aciertos) a partir de correctas e incorrectas.
export function calcularPrecision(correctas, incorrectas) {
  const total = correctas + incorrectas;
  if (total === 0) return 0;
  return Math.round((correctas / total) * 100);
}

// Calcula una puntuación simple: puntos por acierto, penalización leve por error.
// tiempoSegundos es opcional, premia terminar rápido cuando el objetivo es 'time'.
export function calcularPuntuacion({ correctas, incorrectas, tiempoSegundos = null, goal = 'flawless' }) {
  const base = correctas * 100 - incorrectas * 40;
  let bono = 0;
  if (goal === 'time' && tiempoSegundos != null) {
    bono = Math.max(0, 300 - tiempoSegundos) * 2;
  }
  return Math.max(0, Math.round(base + bono));
}

// Decide si el jugador sube de nivel según la meta de la dificultad.
// goal 'flawless' -> sube si no hubo ningún error.
// goal 'time' -> sube si terminó dentro del límite de tiempo.
export function subeDeNivel({ goal, incorrectas, tiempoSegundos, timeLimitSec }) {
  if (goal === 'flawless') return incorrectas === 0;
  if (goal === 'time') return timeLimitSec == null || (tiempoSegundos != null && tiempoSegundos <= timeLimitSec);
  return false;
}

// Arma el resultado final de una partida, listo para guardar en el store
// y para mostrar en la pantalla de resultados.
export function calcularResultado({ correctas, incorrectas, tiempoSegundos, config }) {
  const precision = calcularPrecision(correctas, incorrectas);
  const puntuacion = calcularPuntuacion({ correctas, incorrectas, tiempoSegundos, goal: config.goal });
  const subeNivel = subeDeNivel({
    goal: config.goal,
    incorrectas,
    tiempoSegundos,
    timeLimitSec: config.timeLimitSec
  });
  return { correctas, incorrectas, precision, puntuacion, subeNivel, tiempoSegundos };
}
