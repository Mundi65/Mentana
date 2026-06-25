// =========================================================================
// CONFIG DE LA APP: MENTANA
// Capa C de la matriz. AQUÍ vive todo lo que cambia por app: marca, textos,
// juegos activos, encuesta, reglas del resumen, planes y logros.
// El motor (/engine) y los juegos (/games) NUNCA tienen textos ni precios
// fijos: todo se lee desde aquí.
// =========================================================================

const appConfig = {

  // ---- MARCA ----
  marca: {
    nombre: 'MENTANA',
    eslogan: 'Afila tu mente, todos los días.',
    icono: '🧠'
  },

  // ---- TEMA ----
  tema: './themes/mentana.css',

  // ---- CATEGORÍAS COGNITIVAS (lista cerrada, no agregar otras) ----
  categorias: [
    { id: 'atencion',  nombre: 'Atención' },
    { id: 'memoria',   nombre: 'Memoria' },
    { id: 'calculo',   nombre: 'Cálculo' },
    { id: 'velocidad', nombre: 'Velocidad' },
    { id: 'logica',    nombre: 'Lógica' }
  ],

  // ---- CATÁLOGO DE HABILIDADES (las que puede usar cualquier juego) ----
  habilidades: [
    { id: 'atencion',                nombre: 'Atención' },
    { id: 'concentracion',           nombre: 'Concentración' },
    { id: 'memoria_trabajo',         nombre: 'Memoria de trabajo' },
    { id: 'memoria_corto_plazo',     nombre: 'Memoria a corto plazo' },
    { id: 'velocidad_procesamiento', nombre: 'Velocidad de procesamiento' },
    { id: 'vision_periferica',       nombre: 'Visión periférica' },
    { id: 'calculo_mental',          nombre: 'Cálculo mental' },
    { id: 'resolucion_problemas',    nombre: 'Resolución de problemas' },
    { id: 'flexibilidad_cognitiva',  nombre: 'Flexibilidad cognitiva' }
  ],

  // ---- JUEGOS ACTIVOS ----
  // Lista de ids de /games que esta app usa. El ORDEN aquí decide en qué
  // orden se programan en la sesión diaria (session.js los toma en orden).
  // Ordenados de más fácil/enganchador a más exigente: Eco de Patrones y
  // Balanza Mental primero (rápidos de entender), Capas del Recuerdo
  // (N-back) al final por ser el más abstracto.
  juegosActivos: ['eco-patrones', 'balanza-mental', 'centinela', 'filtro', 'engranajes', 'capas-recuerdo', 'sopa-de-letras', 'clasificar-colores', 'conecta-tuberias', 'un-trazo', 'rompecabezas-bloques'],

  // ---- TESTS ACTIVOS ----
  // Lista de ids de /tests que esta app usa. Se muestran junto a los juegos
  // en la pantalla "Biblioteca".
  testsActivos: ['estilo-memoria', 'tipo-pensador'],

  // ---- ENCUESTA DE ONBOARDING ----
  encuesta: [
    { id: 'pais', tipo: 'single', guarda: 'pais',
      texto: '¿En qué país usarás MENTANA?',
      opciones: ['Ecuador', 'México', 'Colombia', 'Perú', 'Chile', 'Argentina', 'España', 'Estados Unidos', 'Otro'] },
    { id: 'edad', tipo: 'single', guarda: 'rangoEdad',
      texto: '¿Cuál es tu rango de edad?',
      opciones: ['13–17', '18–29', '30–44', '45–59', '60 o más'] },
    { id: 'objetivos', tipo: 'multi', guarda: 'objetivos',
      texto: '¿Qué te gustaría mejorar?',
      opciones: ['Memoria', 'Concentración y atención', 'Velocidad de pensamiento', 'Cálculo mental', 'Lógica y resolución de problemas', 'Mantener la mente activa'] },
    { id: 'autoNivel', tipo: 'single', guarda: 'autoNivel',
      texto: 'Hoy, ¿cómo sientes tu memoria y concentración?',
      opciones: ['Muy baja', 'Baja', 'Normal', 'Buena', 'Excelente'] },
    { id: 'experiencia', tipo: 'single', guarda: 'experiencia',
      texto: '¿Has usado apps de entrenamiento cerebral antes?',
      opciones: ['Nunca', 'Un poco', 'Bastante'] },
    { id: 'motivacion', tipo: 'single', guarda: 'motivacion',
      texto: '¿Qué te motiva más a entrenar?',
      opciones: ['Rendir mejor en estudios o trabajo', 'Salud cerebral a largo plazo', 'Curiosidad y autoconocimiento', 'Recomendación de un profesional', 'Superarme y competir'] },
    { id: 'minDia', tipo: 'single', guarda: 'minDia',
      texto: '¿Cuánto tiempo quieres dedicar al día?',
      opciones: [ { label: '3 min', valor: 3 }, { label: '5 min', valor: 5 }, { label: '10 min', valor: 10 }, { label: '15 min o más', valor: 15 } ] },
    { id: 'diasSemana', tipo: 'single', guarda: 'diasSemana',
      texto: '¿Cuántos días por semana quieres entrenar?',
      opciones: [ { label: '3 días', valor: 3 }, { label: '5 días', valor: 5 }, { label: '7 días', valor: 7 } ] },
    { id: 'franja', tipo: 'single', guarda: 'franja', opcional: true,
      texto: '¿Cuándo prefieres entrenar?',
      opciones: ['Mañana', 'Tarde', 'Noche'] },
    { id: 'recordatorios', tipo: 'single', guarda: 'recordatorios', opcional: true,
      texto: '¿Quieres recordatorios para no perder tu racha?',
      opciones: ['Sí', 'No'] }
  ],

  // ---- REGLAS DEL RESUMEN (sin IA, por cálculo) ----
  reglasResumen: {
    horizonte: [
      { min: 105, texto: 'en unas 3 semanas' },
      { min: 50,  texto: 'en unas 4 a 5 semanas' },
      { min: 25,  texto: 'en unas 6 a 8 semanas' },
      { min: 0,   texto: 'en unas 8 a 10 semanas, con constancia' }
    ],
    plantilla: 'Tu plan se enfoca en {objetivos}. Con {minDia} min al día, {diasSemana} días por semana, si mantienes la constancia empezarás a notar progreso en estos ejercicios {horizonte}. Tu meta de racha será de {diasSemana} días por semana. ¡Vamos a afilar tu mente!',
    nivelInicialPorAuto: { 'Muy baja': 1, 'Baja': 1, 'Normal': 2, 'Buena': 3, 'Excelente': 3 }
  },

  // ---- PLANES Y PAGO ----
  planes: [
    { id: 'mensual', nombre: 'Plan Mensual', precio: 4.99, moneda: 'USD', periodo: 'mes' },
    { id: 'anual',   nombre: 'Plan Anual',   precio: 39.99, moneda: 'USD', periodo: 'año', destacado: true, ahorro: 'Ahorra 33%' }
  ],

  // ---- PRUEBA GRATIS ----
  diasPrueba: 7,

  // ---- PAGOS: enrutador por región (Fase 2 llena los adaptadores reales) ----
  pagos: {
    paisPorDefecto: 'Estados Unidos',
    respaldoGlobal: 'stub',
    pasarelasPorRegion: {
      'Ecuador': 'stub'
      // Fase 2: 'Ecuador': 'payphone', 'México': 'mercadopago', etc.
    }
  },

  // ---- LOGROS ----
  logros: [
    { id: 'primer-paso', nombre: 'Primer paso', descripcion: 'Completa tu primera sesión de entrenamiento.', icono: '🌱', condicion: { tipo: 'sesionesCompletadas', valor: 1 } },
    { id: 'racha-3',     nombre: 'Constancia',  descripcion: 'Entrena 3 días seguidos.', icono: '🔥', condicion: { tipo: 'racha', valor: 3 } },
    { id: 'racha-7',     nombre: 'Una semana de filo', descripcion: 'Entrena 7 días seguidos.', icono: '🔥', condicion: { tipo: 'racha', valor: 7 } },
    { id: 'precision-perfecta', nombre: 'Precisión perfecta', descripcion: 'Termina un juego sin errores.', icono: '🎯', condicion: { tipo: 'precisionJuego', valor: 100 } }
  ],

  // ---- SESIÓN DIARIA ----
  sesion: {
    juegosPorSesion: 3
  },

  // ---- TEXTOS DE INTERFAZ (todo lo visible en español) ----
  textos: {
    bienvenidaTitulo: 'Bienvenido a MENTANA',
    bienvenidaSubtitulo: 'Tu entrenamiento cerebral diario, en pocos minutos.',
    botonEmpezar: 'Empezar',
    botonContinuar: 'Continuar',
    botonVerPlanes: 'Ver planes',
    botonProbarGratis: 'Probar gratis',
    resumenTitulo: 'Tu plan está listo',
    paywallTitulo: 'Elige tu plan',
    homeTitulo: 'Hoy entrenas',
    cargando: 'Cargando…'
  }
};

export default appConfig;
