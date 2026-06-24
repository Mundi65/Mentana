# ENCUESTA DE ARRANQUE + REGLAS DEL RESUMEN (MENTANA)

Esto es el contenido del onboarding (pasos 2 y 3 del flujo). Cada pregunta indica
**dónde se guarda** el dato y **para qué sirve** ahora y en decisiones futuras.
Todo se guarda en `localStorage` en la v1 (cuando haya nube, agregar aviso de
privacidad). Estos textos van en `/config/app.config.js`, no fijos en el código.

> Principio honesto del resumen: prometemos progreso en *los ejercicios que se
> entrenan* y construir el hábito, NO mejoras médicas ni de CI. Mantener esto
> evita publicidad engañosa y problemas a futuro.

---

## Las preguntas

**1. País / región** — `store.pais`
"¿En qué país usarás MENTANA?"
Ecuador · México · Colombia · Perú · Chile · Argentina · España · Estados Unidos · Otro
→ Uso: **enruta el pago** a la pasarela de esa región, localización y precios.
(Se confirma/rellena con IP como respaldo.) Dato crítico.

**2. Rango de edad** — `store.rangoEdad`
"¿Cuál es tu rango de edad?"
13–17 · 18–29 · 30–44 · 45–59 · 60 o más
→ Uso: sembrar dificultad inicial, segmentar, y decidir futuras apps de nicho
(mayores, escolar) desde la misma matriz.

**3. Objetivos** (selección múltiple) — `store.objetivos[]`
"¿Qué te gustaría mejorar?"
Memoria · Concentración y atención · Velocidad de pensamiento · Cálculo mental ·
Lógica y resolución de problemas · Mantener la mente activa
→ Uso: arma el plan, prioriza qué categorías de juegos aparecen primero, y guía
**qué juegos construir después** (los más pedidos).

**4. Autoevaluación** — `store.autoNivel`
"Hoy, ¿cómo sientes tu memoria y concentración?"
Muy baja · Baja · Normal · Buena · Excelente
→ Uso: nivel de dificultad de partida (no empezar demasiado fácil/difícil).

**5. Experiencia previa** — `store.experiencia`
"¿Has usado apps de entrenamiento cerebral antes?"
Nunca · Un poco · Bastante
→ Uso: ritmo del tutorial y mensajes; análisis de mercado.

**6. Motivación** — `store.motivacion`
"¿Qué te motiva más a entrenar?"
Rendir mejor en estudios o trabajo · Salud cerebral a largo plazo ·
Curiosidad y autoconocimiento · Recomendación de un profesional · Superarme y competir
→ Uso: personalizar mensajes de retención y el copy del resumen.

**7. Minutos por día** — `store.minDia`
"¿Cuánto tiempo quieres dedicar al día?"
3 min · 5 min · 10 min · 15 min o más
→ Uso: tamaño de la sesión diaria + cálculo del horizonte del resumen.

**8. Días por semana** — `store.diasSemana`
"¿Cuántos días por semana quieres entrenar?"
3 días · 5 días · 7 días
→ Uso: **meta de racha** + cálculo del horizonte.

**9. Mejor momento (opcional)** — `store.franja`
"¿Cuándo prefieres entrenar?"
Mañana · Tarde · Noche
→ Uso: recordatorios/notificaciones (fase 2).

**10. Recordatorios (opcional)** — `store.recordatorios`
"¿Quieres recordatorios para no perder tu racha?"
Sí · No
→ Uso: opt-in para notificaciones (fase 2). Guardar la decisión desde ya.

> Sugerencia: 8 preguntas obligatorias (1–8) + 2 opcionales (9–10). Si quieres un
> onboarding más corto, las 9 y 10 pueden moverse a Ajustes después.

---

## Reglas del resumen (sin IA, por cálculo)

**Paso A — Horizonte** a partir del tiempo semanal:
`minutosSemana = minDia × diasSemana`

| minutosSemana | Texto de horizonte                          |
|---------------|---------------------------------------------|
| 105 o más     | "en unas 3 semanas"                         |
| 50 – 104      | "en unas 4 a 5 semanas"                     |
| 25 – 49       | "en unas 6 a 8 semanas"                     |
| menos de 25   | "en unas 8 a 10 semanas, con constancia"    |

**Paso B — Enfoque** a partir de `objetivos[]`: lista los objetivos elegidos en
lenguaje natural (ej. "memoria, concentración y cálculo mental").

**Paso C — Plantilla del texto** (rellena los {campos}):

> "Tu plan se enfoca en {objetivos}. Con {minDia} min al día, {diasSemana} días por
> semana, si mantienes la constancia empezarás a notar progreso en estos ejercicios
> {horizonte}. Tu meta de racha será de {diasSemana} días por semana. ¡Vamos a
> afilar tu mente!"

**Nivel inicial sugerido** (a partir de `autoNivel`, opcional):
Muy baja/Baja → nivel 1 · Normal → nivel 2 · Buena/Excelente → nivel 3.

---

## Bloque listo para `/config/app.config.js`

```js
// --- Encuesta de onboarding ---
encuesta: [
  { id: 'pais', tipo: 'single', guarda: 'pais',
    texto: '¿En qué país usarás MENTANA?',
    opciones: ['Ecuador','México','Colombia','Perú','Chile','Argentina','España','Estados Unidos','Otro'] },
  { id: 'edad', tipo: 'single', guarda: 'rangoEdad',
    texto: '¿Cuál es tu rango de edad?',
    opciones: ['13–17','18–29','30–44','45–59','60 o más'] },
  { id: 'objetivos', tipo: 'multi', guarda: 'objetivos',
    texto: '¿Qué te gustaría mejorar?',
    opciones: ['Memoria','Concentración y atención','Velocidad de pensamiento','Cálculo mental','Lógica y resolución de problemas','Mantener la mente activa'] },
  { id: 'autoNivel', tipo: 'single', guarda: 'autoNivel',
    texto: 'Hoy, ¿cómo sientes tu memoria y concentración?',
    opciones: ['Muy baja','Baja','Normal','Buena','Excelente'] },
  { id: 'experiencia', tipo: 'single', guarda: 'experiencia',
    texto: '¿Has usado apps de entrenamiento cerebral antes?',
    opciones: ['Nunca','Un poco','Bastante'] },
  { id: 'motivacion', tipo: 'single', guarda: 'motivacion',
    texto: '¿Qué te motiva más a entrenar?',
    opciones: ['Rendir mejor en estudios o trabajo','Salud cerebral a largo plazo','Curiosidad y autoconocimiento','Recomendación de un profesional','Superarme y competir'] },
  { id: 'minDia', tipo: 'single', guarda: 'minDia',
    texto: '¿Cuánto tiempo quieres dedicar al día?',
    opciones: [ {label:'3 min',valor:3}, {label:'5 min',valor:5}, {label:'10 min',valor:10}, {label:'15 min o más',valor:15} ] },
  { id: 'diasSemana', tipo: 'single', guarda: 'diasSemana',
    texto: '¿Cuántos días por semana quieres entrenar?',
    opciones: [ {label:'3 días',valor:3}, {label:'5 días',valor:5}, {label:'7 días',valor:7} ] },
  { id: 'franja', tipo: 'single', guarda: 'franja', opcional: true,
    texto: '¿Cuándo prefieres entrenar?',
    opciones: ['Mañana','Tarde','Noche'] },
  { id: 'recordatorios', tipo: 'single', guarda: 'recordatorios', opcional: true,
    texto: '¿Quieres recordatorios para no perder tu racha?',
    opciones: ['Sí','No'] }
],

// --- Reglas del resumen (sin IA) ---
reglasResumen: {
  horizonte: [
    { min: 105, texto: 'en unas 3 semanas' },
    { min: 50,  texto: 'en unas 4 a 5 semanas' },
    { min: 25,  texto: 'en unas 6 a 8 semanas' },
    { min: 0,   texto: 'en unas 8 a 10 semanas, con constancia' }
  ],
  plantilla: 'Tu plan se enfoca en {objetivos}. Con {minDia} min al día, {diasSemana} días por semana, si mantienes la constancia empezarás a notar progreso en estos ejercicios {horizonte}. Tu meta de racha será de {diasSemana} días por semana. ¡Vamos a afilar tu mente!',
  nivelInicialPorAuto: { 'Muy baja':1, 'Baja':1, 'Normal':2, 'Buena':3, 'Excelente':3 }
}
```
