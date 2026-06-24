# LÉEME PRIMERO — MENTANA · Guía para arrancar en Claude Code

App: **MENTANA** (entrenamiento cerebral, matriz reutilizable). Marca provisional.
Stack: frontend puro (HTML/CSS/JS), PWA, deploy en GitHub Pages (Mundi65).
Este documento te dice qué crear, dónde va cada archivo y en qué orden avanzar.

---

## 1. Los archivos de este paquete

| Archivo                    | Qué es                                              | ¿Va al repo? |
|----------------------------|-----------------------------------------------------|--------------|
| `CLAUDE.md`                | Prompt maestro. Claude Code lo lee en cada sesión.  | Sí (raíz)    |
| `SKILL.md`                 | Contrato que todo juego debe cumplir.               | Sí (.claude) |
| `mentana.css`              | Tema: paleta y tipografía (design tokens).          | Sí (/themes) |
| `PROMPT_DE_ARRANQUE.md`    | El primer mensaje que pegas en Claude Code.         | Guía         |
| `ENCUESTA_y_RESUMEN.md`    | Contenido del onboarding (preguntas + resumen).     | Guía/docs    |
| `PAGOS_arquitectura.md`    | Diseño del módulo de pagos por región.              | Guía/docs    |
| `paleta_mentana.html`      | Vista previa de la paleta (solo para mirar).        | No (opcional)|

---

## 2. Crea esta estructura ANTES de abrir Claude Code

En la carpeta de tu repo, crea las carpetas y coloca los 3 archivos de código.
Lo demás (engine, games, screens) lo creará Claude Code paso a paso.

```
mi-repo-mentana/
├── CLAUDE.md                       ← coloca aquí
├── .claude/
│   └── skills/
│       └── juego-cognitivo/
│           └── SKILL.md            ← coloca aquí (ojo: carpetas con punto)
├── themes/
│   └── mentana.css                 ← coloca aquí
└── docs/                           ← opcional, para tus guías
    ├── ENCUESTA_y_RESUMEN.md
    └── PAGOS_arquitectura.md
```

> En Windows, para crear `.claude` (empieza con punto) usa el explorador con
> "mostrar archivos ocultos", o créala desde Claude Code/terminal si te resulta
> más fácil.

---

## 3. Pasos para arrancar

1. Crea el repo en GitHub (cuenta **Mundi65**) y clónalo, o crea la carpeta local.
2. Arma la estructura de arriba y coloca `CLAUDE.md`, `SKILL.md` y `mentana.css`.
3. Abre **Claude Code DENTRO de la carpeta del repo** (importante: así lee CLAUDE.md solo).
4. Abre `PROMPT_DE_ARRANQUE.md`, copia SOLO el bloque entre las líneas `=== ... ===`
   y pégalo como tu primer mensaje.
5. Claude Code hará el **Paso 1** y se detendrá. Mándale captura o "ok". Sigue así
   hasta el Paso 6.

---

## 4. Qué construye, en orden (los 6 pasos)

1. **Esqueleto + config + tema** → ves "MENTANA" con la paleta aplicada.
2. **Motor base** → store (localStorage), router, scoring, streak, achievements y pantallas vacías.
3. **Onboarding** → bienvenida + encuesta + resumen ("qué conseguirás y en cuánto").
4. **Planes + pago (stub) + prueba gratis** → muro de pago y control de acceso.
5. **Runner + primer juego (Fantasmas Ocultos) + resultados + logros + racha** → ciclo completo jugable.
6. **Progreso + logros + PWA** → instalable y offline, lista para GitHub Pages.

---

## 5. Recordatorios clave (de tu forma de trabajar)

- **Una capa, una cosa:** motor en `/engine`, juegos en `/games`, marca/colores/textos en `/config` y `/themes`. Nunca se mezclan.
- **Sin colores ni textos fijos** en el código: todo sale del tema y del config.
- **Avanza por pasos** y confirma por captura antes de seguir. No pidas todo de golpe.
- **Pagos y IA = fase 2.** En la v1 el pago es un stub que da la prueba gratis; el cobro real (PayPhone Ecuador + pasarela global) y el coach IA se enchufan después sin reescribir nada.
- **Nada de claves secretas en el frontend.**

---

## 6. Lo que queda por decidir (cuando quieras, va en /config, no toca el motor)

- Precios reales de los planes (mensual/anual) y moneda.
- Número de días de prueba gratis.
- Lista final de juegos por categoría (cuántos y cuáles para el lanzamiento).
- Logros definitivos (nombres y condiciones).

Cuando los tengas, son cambios de una o dos líneas en `app.config.js`.
