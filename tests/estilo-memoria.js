// /tests/estilo-memoria.js — categoría: cognitivo
// Test corto de autoconocimiento: ayuda al usuario a entender CÓMO memoriza
// mejor (no mide inteligencia ni capacidad, solo preferencia/estilo).

export default {
  id: 'estilo-memoria',
  name: '¿Cuál es tu estilo de memoria?',
  tipo: 'cognitivo',
  icon: '🧩',
  descripcion: 'Descubre si memorizas mejor con imágenes, con sonidos o haciendo las cosas con tus manos.',

  preguntas: [
    {
      texto: 'Para recordar un número de teléfono, te resulta más fácil...',
      opciones: [
        { label: 'Imaginar cómo se ve escrito', perfil: 'visual' },
        { label: 'Repetirlo en voz alta varias veces', perfil: 'auditivo' },
        { label: 'Marcarlo en el teclado hasta que "se me queda en los dedos"', perfil: 'kinestesico' }
      ]
    },
    {
      texto: 'Cuando estudias algo nuevo, prefieres...',
      opciones: [
        { label: 'Ver diagramas, colores o esquemas', perfil: 'visual' },
        { label: 'Escuchar una explicación o un audio', perfil: 'auditivo' },
        { label: 'Practicarlo tú mismo, con las manos', perfil: 'kinestesico' }
      ]
    },
    {
      texto: 'Si pierdes las llaves, recuerdas dónde las dejaste porque...',
      opciones: [
        { label: 'Visualizas el lugar exacto', perfil: 'visual' },
        { label: 'Recuerdas qué estabas diciendo o pensando en ese momento', perfil: 'auditivo' },
        { label: 'Recuerdas el movimiento de tu mano al dejarlas', perfil: 'kinestesico' }
      ]
    },
    {
      texto: 'En una clase o reunión, tomas notas para...',
      opciones: [
        { label: 'Tener algo visual a lo que volver', perfil: 'visual' },
        { label: 'En realidad casi no necesitas notas, recuerdas lo que se dijo', perfil: 'auditivo' },
        { label: 'El simple acto de escribir te ayuda a recordar', perfil: 'kinestesico' }
      ]
    },
    {
      texto: 'Recuerdas mejor una canción si...',
      opciones: [
        { label: 'Viste el video o la letra escrita', perfil: 'visual' },
        { label: 'Solo la escuchaste un par de veces', perfil: 'auditivo' },
        { label: 'La bailaste o tocaste un instrumento mientras sonaba', perfil: 'kinestesico' }
      ]
    },
    {
      texto: 'Para armar un mueble nuevo, prefieres...',
      opciones: [
        { label: 'Ver las imágenes del instructivo', perfil: 'visual' },
        { label: 'Que alguien te explique los pasos en voz alta', perfil: 'auditivo' },
        { label: 'Ir probando piezas hasta que encajen, sin leer mucho', perfil: 'kinestesico' }
      ]
    }
  ],

  perfiles: {
    visual: {
      nombre: 'Memoria Visual',
      descripcion: 'Memorizas mejor cuando puedes VER la información: imágenes, colores, diagramas, mapas mentales. En MENTANA, juegos como Eco de Patrones y Engranajes le hablan directo a este estilo.'
    },
    auditivo: {
      nombre: 'Memoria Auditiva',
      descripcion: 'Memorizas mejor cuando ESCUCHAS la información: explicaciones habladas, repetición en voz alta, música. Te puede ayudar repetir en voz alta lo que quieres recordar.'
    },
    kinestesico: {
      nombre: 'Memoria Kinestésica',
      descripcion: 'Memorizas mejor HACIENDO: practicando con las manos, moviéndote, repitiendo la acción física. Tomar notas a mano (aunque no las releas) probablemente te ayuda más que solo leer.'
    }
  }
};
