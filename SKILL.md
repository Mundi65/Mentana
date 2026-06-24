---
name: juego-cognitivo
description: Contrato y plantilla obligatoria para crear o modificar cualquier módulo de juego en /games. Úsalo SIEMPRE antes de tocar un juego, para que encaje en el motor sin romper nada. Define la interfaz que el motor espera, las categorías cognitivas válidas, cómo se reporta puntuación/precisión/etapas y cómo se maneja la dificultad por niveles.
---

# Contrato del Juego Cognitivo

Todo juego en `/games` es un **módulo enchufable**. El motor (`/engine`) no conoce
los detalles internos del juego: solo lo invoca a través de este contrato. Si un
juego respeta este contrato, funciona en la app sin tocar el motor.

## 1. Forma del módulo

Cada juego exporta por defecto un objeto con METADATA + dos funciones de ciclo de vida:

```js
// /games/ejemplo.js
export default {
  // ---- METADATA (la usan las pantallas de intro y de resultados) ----
  id: 'ejemplo',                 // único, en minúsculas, sin espacios
  name: 'Nombre Visible',        // texto en español, se muestra al usuario
  category: 'memoria',           // SOLO una de: atencion | memoria | calculo | velocidad | logica
  skills: ['memoria_trabajo', 'concentracion'], // habilidades entrenadas (ver lista abajo)
  icon: '👻',                    // emoji o ruta a SVG
  instructions: 'Memoriza la posición y tócala.', // breve, español

  // ---- DIFICULTAD: dado un nivel, devuelve la config de ESE nivel ----
  difficulty(level) {
    // level empieza en 1 y sube. Devuelve un plan para la partida.
    return {
      stages: 5,            // cuántas etapas tiene la partida
      timeLimitSec: 65,     // límite total (o null si no aplica)
      goal: 'time',         // 'time' (terminar a tiempo) | 'flawless' (sin errores)
      params: { gridSize: 3 + level } // parámetros propios del juego
    };
  },

  // ---- MOUNT: el motor te entrega el contenedor y un ctx con helpers ----
  // Aquí dibujas y corres el juego. Reportas TODO a través de ctx.
  mount(container, ctx) {
    // container: elemento DOM vacío donde dibujar la partida.
    // ctx: objeto con helpers del motor (ver sección 3).
    // ...lógica del juego...
  }
};
```

## 2. Reglas del módulo

1. **Una sola categoría** por juego (de la lista cerrada de arriba).
2. **Nada de colores/fuentes fijos.** Usa las clases y variables CSS del tema
   (ej. `var(--color-primario)`). Si falta un token, pídelo, no lo inventes en línea.
3. **Todo texto al usuario en español**, y preferiblemente recibido vía `ctx.t(...)`
   si la cadena debe ser configurable por app.
4. **El juego NO toca localStorage ni navega.** De eso se encarga el motor. El juego
   solo dibuja, escucha respuestas y reporta resultados por `ctx`.
5. **Limpieza:** al terminar, deja el `container` en condiciones de ser vaciado por
   el motor (no dejes timers ni listeners colgando; usa `ctx.onCleanup`).

## 3. El objeto `ctx` que entrega el motor

El motor pasa a `mount(container, ctx)` estos helpers. NO los redefinas:

```
ctx.level                 // nivel actual del jugador en este juego (número)
ctx.config                // el resultado de difficulty(level) ya calculado
ctx.t(clave)              // devuelve un texto configurable desde app.config
ctx.startStage(n)         // avisa al motor que empieza la etapa n
ctx.reportAnswer(boolean) // reporta una respuesta: true=correcta, false=incorrecta
ctx.finishStage()         // termina la etapa actual
ctx.finishGame()          // termina la partida; el motor calcula score/precisión y
                          //   muestra la pantalla de resultados automáticamente
ctx.onCleanup(fn)         // registra una función de limpieza (timers, listeners)
ctx.timeLeftSec()         // segundos restantes (si la dificultad usa límite de tiempo)
```

El motor, a partir de los `reportAnswer` y del tiempo, calcula automáticamente:
correctas, incorrectas, precisión, puntuación, y si sube de nivel. El juego NO
calcula nada de eso.

## 4. Habilidades entrenadas (valores válidos para `skills`)

Usa estas claves (se muestran con su texto en la pantalla de intro):
`atencion`, `concentracion`, `memoria_trabajo`, `memoria_corto_plazo`,
`velocidad_procesamiento`, `vision_periferica`, `calculo_mental`,
`resolucion_problemas`, `flexibilidad_cognitiva`.

Si necesitas una habilidad nueva, agrégala primero al catálogo en
`/config/app.config.js` (con su nombre y descripción en español) y luego úsala.

## 5. Checklist antes de dar por hecho un juego

- [ ] Tiene `id`, `name`, `category` (válida), `skills` (válidas), `icon`, `instructions`.
- [ ] `difficulty(level)` escala de verdad con el nivel (no es siempre igual).
- [ ] Reporta cada respuesta con `ctx.reportAnswer(...)`.
- [ ] Llama a `ctx.finishGame()` al terminar.
- [ ] Registra limpieza con `ctx.onCleanup(...)`.
- [ ] No usa colores/fuentes fijos ni toca localStorage ni navega.
- [ ] Textos en español.

## 6. Ejemplo mínimo (esqueleto de referencia)

```js
// /games/fantasmasOcultos.js  — categoría: memoria
export default {
  id: 'fantasmas-ocultos',
  name: 'Fantasmas Ocultos',
  category: 'memoria',
  skills: ['memoria_trabajo', 'concentracion'],
  icon: '👻',
  instructions: 'Recuerda dónde aparecieron los fantasmas y tócalos en orden.',

  difficulty(level) {
    return {
      stages: 3 + level,
      timeLimitSec: null,
      goal: 'flawless',
      params: { ghosts: 2 + level, gridSize: 4 }
    };
  },

  mount(container, ctx) {
    let stage = 1;
    const playStage = () => {
      ctx.startStage(stage);
      // ...dibuja la cuadrícula, muestra fantasmas, escucha toques...
      // por cada toque: ctx.reportAnswer(esCorrecto);
      // cuando la etapa acaba:
      ctx.finishStage();
      if (stage < ctx.config.stages) { stage++; playStage(); }
      else { ctx.finishGame(); }
    };
    ctx.onCleanup(() => { /* limpiar timers/listeners */ });
    playStage();
  }
};
```
