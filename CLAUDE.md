# CLAUDE.md — Prompt Maestro del Proyecto

> Este archivo lo lee Claude Code automáticamente al inicio de CADA sesión.
> Es la fuente de verdad del proyecto. No lo contradigas. Si algo aquí
> entra en conflicto con una petición puntual, avísamelo antes de actuar.

---

## 1. Visión

Estoy construyendo un **motor cognitivo reutilizable** (un *engine*), no una sola
app. Objetivo: a partir de UNA matriz, generar VARIAS apps de entrenamiento
cerebral cambiando solo la marca, la paleta y la selección de juegos —
manteniendo intacto el motor. Es el modelo Duolingo.

App de referencia (solo inspiración de mecánicas, NO copiar): Impulse. De ahí
tomo el *método*: onboarding con encuesta, resumen de objetivos, planes/pago,
sesión diaria de varios juegos, niveles que se suben con metas, racha, logros,
progreso y pantallas de resultados con comparación y precisión.

**Primera instancia:** entrenamiento cerebral general, todo público.
Marca: **MENTANA** (definida en `/config` y `/themes/mentana.css`).

---

## 2. Regla de oro: TRES CAPAS que NO se mezclan

### Capa A — EL MOTOR (`/engine`) — reutilizable, NO cambia entre apps
Toda la "esencia" común: onboarding, encuesta, resumen, planes/pago, prueba
gratis, sesión diaria, game loop, puntuación, niveles, racha, logros, progreso,
pantallas y modales.

### Capa B — LOS JUEGOS (`/games`) — módulos enchufables
Cada juego cumple el contrato de `.claude/skills/juego-cognitivo/SKILL.md`. El
motor no conoce detalles de ningún juego.

### Capa C — TEMA + CONFIG (`/config` y `/themes`) — lo único que cambia por app
- `/config/app.config.js`: marca, juegos activos, categorías, textos, encuesta,
  reglas del resumen, planes/precios, días de prueba, logros y **mapa de pasarelas
  de pago por región**.
- `/themes/mentana.css`: paleta y tipografía como variables CSS (design tokens).
- Nueva app = nuevo config + nuevo tema + selección de juegos. CERO cambios en
  `/engine` ni en `/games`.

---

## 3. Stack técnico (v1)

- Frontend puro: HTML + CSS + JavaScript vanilla con **ES Modules**.
- Sin frameworks, sin build step. Abre como sitio estático.
- Estado: `localStorage`.
- PWA: `manifest.json` + service worker.
- Gráficas: Canvas/SVG nativo. Nada pesado.
- Deploy: GitHub Pages, cuenta **Mundi65**. Rutas relativas.

Reservado para FASE 2 (dejar el "hueco", NO implementar ahora):
- **Cobros reales:** PayPhone (Ecuador) y una pasarela global (Stripe/PayPal) para
  el resto; Mercado Pago por país donde el volumen lo justifique. Todos requieren
  un backend pequeño (Render). Ver punto 5 y el doc `PAGOS_arquitectura.md`.
- Coach con IA vía Claude API.
- Perfiles/rankings en la nube con Supabase.

---

## 4. Flujo de PRIMER ARRANQUE (onboarding) — guardado en localStorage

La primera vez corre esta máquina de estados. En arranques posteriores va directo
a Home (salvo que la prueba haya vencido → vuelve al muro de pago).

1. **Bienvenida** — presenta MENTANA.
2. **Encuesta** — preguntas de `/config` (país, edad, objetivos, autoevaluación,
   experiencia, motivación, minutos/día, días/semana, + opcionales). Guardar todo.
   El `pais` también alimenta el enrutador de pagos. Ver `ENCUESTA_y_RESUMEN.md`.
3. **Resumen** — "qué conseguirás y en cuánto tiempo", por REGLAS de `/config`
   (sin IA). Marco honesto: progreso en los ejercicios y hábito, sin promesas
   médicas ni de CI.
4. **Planes y pago** — muestra planes/precios de `/config`. El enrutador elige la
   pasarela según el país (punto 5). Si el pago NO se completa → **prueba gratis de
   N días** (N en `/config`) y deja entrar.
5. **Home / Empezar entrenamiento.**

Acceso posterior: suscripción activa → entra; en prueba con días → entra; prueba
vencida sin suscripción → muro de pago. Lógica en `/engine`, valores en `/config`.

---

## 5. Pagos = ENRUTADOR por región + ADAPTADORES enchufables

(Diseño completo en `PAGOS_arquitectura.md`. Resumen operativo aquí.)

- Se detecta el país: primario = `store.pais` (encuesta); respaldo = IP. Se guarda
  `store.paisISO`.
- El **enrutador** (`/engine/payments.js`) elige la pasarela usando el mapa
  `pagos.pasarelasPorRegion` de `/config`; si no hay, usa `pagos.respaldoGlobal`;
  si tampoco está lista, muestra "pago internacional próximamente" + prueba gratis.
- Cada **pasarela es un adaptador** con interfaz fija:
  `async intentarCobro(plan, ctx) -> { estado: 'exito'|'cancelado'|'fallo', referencia? }`
- **v1:** construir enrutador + interfaz de adaptador + detección de país, con UN
  adaptador STUB que devuelve 'cancelado' (activa la prueba gratis). Permite probar
  TODO el flujo sin cobrar.
- **Fase 2:** agregar adaptadores reales (PayPhone EC; Stripe/PayPal global; Mercado
  Pago por país) creando un archivo por pasarela y una línea en el mapa. El motor y
  las pantallas NO cambian.
- **Seguridad:** NINGUNA clave/secreto de pago en el frontend; van en el backend.

---

## 6. Estructura de carpetas

```
/
├── CLAUDE.md
├── index.html
├── manifest.json
├── sw.js
├── /engine
│   ├── app.js            arranque: carga config + tema + decide onboarding/home
│   ├── store.js          localStorage (perfil, respuestas encuesta, paisISO,
│   │                     suscripcion/prueba, scores, racha, progreso, logros)
│   ├── router.js         navegación entre pantallas
│   ├── onboarding.js     máquina de estados del primer arranque
│   ├── geo.js            detección de país (encuesta primero, IP de respaldo)
│   ├── payments.js       ENRUTADOR de pagos + adaptadores (v1 = stub)
│   ├── session.js        arma la sesión diaria
│   ├── gameRunner.js     ejecuta un juego usando el CONTRATO de SKILL.md
│   ├── scoring.js        puntos, precisión, niveles/dificultad
│   ├── streak.js         racha (se anula al abandonar un día)
│   ├── achievements.js   evalúa y desbloquea logros
│   └── /screens
│       ├── welcome.js · survey.js · summary.js · paywall.js
│       ├── home.js · gameIntro.js · gamePlay.js · gameResult.js
│       ├── progress.js · achievements.js · streakScreen.js · modals.js
├── /games
│   └── fantasmasOcultos.js   primer juego (categoría: memoria)
├── /themes
│   └── mentana.css             design tokens (paleta + tipografía)
└── /config
    └── app.config.js         TODO lo configurable por app (ver punto 7)
```

---

## 7. Qué contiene `/config/app.config.js`

- `marca`: nombre, eslogan, ícono.
- `tema`: ruta del CSS de tema.
- `categorias`, `habilidades`, `juegosActivos`.
- `encuesta`: preguntas (ver `ENCUESTA_y_RESUMEN.md`).
- `reglasResumen`: cómo se calcula el resumen sin IA.
- `planes`: lista (nombre, precio, periodo, moneda).
- `diasPrueba`: días gratis si no se completa el pago.
- `pagos`: `{ paisPorDefecto, respaldoGlobal, pasarelasPorRegion }`.
- `logros`: definiciones (id, nombre, descripción, ícono, condición).
- `sesion`: cuántos juegos por sesión.
- `textos`: todas las cadenas visibles (interfaz en español).

---

## 8. Reglas de trabajo (IMPORTANTE)

1. **Cambios quirúrgicos.** Modifica lo mínimo. No reescribas archivos completos ni
   "mejores" cosas no pedidas. No rompas lo que funciona.
2. **Avanza por pasos y pide confirmación.** Tras cada paso: di qué archivos tocaste
   (ruta exacta), explícalo simple y di qué debo ver. Luego DETENTE y espera mi ok.
3. **No soy programador.** Archivos completos, listos para guardar, con su ruta.
4. **Interfaz en español.** Textos visibles SIEMPRE desde `/config`, nunca fijos.
5. **Cero colores/fuentes fijos.** Todo desde variables CSS de `/themes`.
6. **Respeta el contrato de juegos** antes de crear/tocar un juego.
7. **Mantén las 3 capas** separadas pase lo que pase.
8. **Seguridad:** ninguna clave/secreto en el frontend (pago, API, etc.).
9. **Deploy** para GitHub Pages (rutas relativas, sin servidor).

---

## 9. Glosario

- **Onboarding**: bienvenida→encuesta→resumen→pago→home (primer arranque).
- **Enrutador de pagos**: elige la pasarela según el país del usuario.
- **Adaptador de pasarela**: módulo con interfaz fija para una pasarela concreta.
- **Sesión diaria**: N juegos seguidos; al completarla suma a la racha.
- **Etapa**: una ronda dentro de un juego.
- **Nivel/Dificultad**: sube al cumplir la meta (tiempo o sin errores).
- **Precisión**: % de aciertos.
- **Racha**: días seguidos entrenando; se reinicia a 0 si se pierde un día.
- **Logro**: hito desbloqueable de `/config`.
- **Prueba gratis**: N días de acceso si no se completa el pago inicial.
- **Categorías**: atencion, memoria, calculo, velocidad, logica.
```
