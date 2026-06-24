# PROMPT DE ARRANQUE — pégalo en Claude Code (primer mensaje del proyecto)

> Antes de empezar, deja estos archivos en su sitio dentro del repo:
> - `CLAUDE.md` en la raíz.
> - `SKILL.md` dentro de `.claude/skills/juego-cognitivo/`.
> - `mentana.css` dentro de `/themes/`.
> Luego abre Claude Code en la carpeta del repo y pega TODO el texto de abajo
> (entre las líneas ===) como tu primer mensaje.

=== INICIO DEL PROMPT ===

Lee primero CLAUDE.md, .claude/skills/juego-cognitivo/SKILL.md y el tema
/themes/mentana.css. Vas a respetar esa arquitectura de 3 capas, ese flujo de
onboarding y esas reglas al pie de la letra. La paleta y tipografía YA están en
mentana.css: úsalas siempre vía variables CSS, no inventes colores.

Soy el dueño y NO soy programador. Avanzamos por pasos cortos. Después de CADA
paso: dime qué archivos creaste con su ruta exacta, explícame en lenguaje sencillo
qué hace cada uno y qué debo ver al abrir index.html. Luego DETENTE y espera mi
"ok" o mi captura antes de continuar.

Construye la PRIMERA app de la matriz: entrenamiento cerebral general, todo
público, marca MENTANA. Sin IA y sin cobro real todavía (la pasarela es el stub que
describe CLAUDE.md; deja preparados los huecos de fase 2 pero no los implementes).
Frontend puro, listo para GitHub Pages.

Plan de pasos (uno a la vez, parando entre cada uno):

PASO 1 — Esqueleto + config + tema.
Crea index.html (shell con #app y enlazando /themes/mentana.css) y
/config/app.config.js con TODA la configuración descrita en el punto 7 de
CLAUDE.md: marca MENTANA y eslogan, categorías, catálogo de habilidades, juegos
activos (de momento vacío), una encuesta inicial de ejemplo (objetivos, alcance,
motivación, minutos/día, días/semana), reglas del resumen, planes (mensual y
anual con precios de ejemplo), diasPrueba, logros de ejemplo, sesión = 3 juegos y
todos los textos en español. Crea /engine/app.js que cargue config + tema y
muestre "MENTANA" para confirmar el enlace. Para. Dime qué ver.

PASO 2 — Motor base.
Crea /engine/store.js (localStorage: perfil, respuestas, suscripción/prueba,
scores, racha, progreso, logros), router.js, scoring.js, streak.js (racha que se
anula al perder un día) y achievements.js. Crea las pantallas base vacías en
/engine/screens (welcome, survey, summary, paywall, home, gameIntro, gamePlay,
gameResult, progress, achievements, streakScreen, modals). Para. Dime qué ver.

PASO 3 — Onboarding: bienvenida + encuesta + resumen.
Implementa /engine/onboarding.js (máquina de estados del primer arranque) y las
pantallas welcome, survey y summary. La encuesta se construye desde
app.config.js; el resumen se calcula por las reglas de config (sin IA) y muestra
"qué conseguirás y en cuánto tiempo". Guarda las respuestas en localStorage.
Para. Dime qué ver.

PASO 4 — Planes, pago (stub) y prueba gratis.
Implementa /engine/payments.js como adaptador STUB (interfaz intentarCobro(plan)
que devuelve 'cancelado') y la pantalla paywall: muestra los planes/precios de
config, botón de pago; si no se completa el pago, activa la prueba gratis de N
días y deja entrar a Home. Implementa también el control de acceso (suscrito /
en prueba / prueba vencida → muro de pago). Para. Dime qué ver.

PASO 5 — Runner + primer juego + resultados + logros + racha.
Crea /engine/gameRunner.js (ejecuta un juego con EXACTAMENTE el contrato de
SKILL.md) y /engine/session.js (arma la sesión diaria desde config). Crea el
primer juego /games/fantasmasOcultos.js siguiendo el contrato y actívalo en
config. Quiero el ciclo completo: Home → sesión → intro del juego → jugarlo por
etapas → pantalla de resultados (correcto/incorrecto/precisión + comparación) →
suma a la racha → desbloquea logros si corresponde. Para. Dime qué ver.

PASO 6 — Progreso, logros y PWA.
Completa las pantallas progress (tendencias en el tiempo) y achievements (logros
conseguidos/por conseguir), y agrega manifest.json + sw.js (instalable y offline,
rutas relativas para GitHub Pages). Para. Dime qué ver.

Empieza por el PASO 1 únicamente.

=== FIN DEL PROMPT ===


## Cómo seguir creciendo la matriz

- Agregar un juego:
  "Lee SKILL.md y crea un juego de categoría <X> llamado <nombre>. Actívalo en
   app.config.js. No toques el motor."

- Crear OTRA app desde la matriz (lo potente):
  "Duplica la app cambiando SOLO /config y /themes: nueva marca <nombre>, nueva
   paleta y esta selección de juegos <lista>. No modifiques /engine ni /games."

- Fase 2 — cobro real:
  "Reemplaza el stub de /engine/payments.js por el adaptador real de PayPhone con
   un backend mínimo en Render. No cambies la interfaz intentarCobro(plan)."

- Fase 2 — coach con IA:
  "En el hueco reservado tras la sesión, envía el resumen de resultados a la
   Claude API y muestra un análisis y plan en español."
