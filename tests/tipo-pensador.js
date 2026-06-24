// /tests/tipo-pensador.js — categoría: personalidad
// Test general de autoconocimiento (no clínico): identifica una tendencia
// dominante en la forma de pensar y tomar decisiones.

export default {
  id: 'tipo-pensador',
  name: '¿Qué tipo de pensador eres?',
  tipo: 'personalidad',
  icon: '💭',
  descripcion: 'Un test rápido sobre cómo procesas la información y tomas decisiones en el día a día.',

  preguntas: [
    {
      texto: 'Frente a un problema nuevo, tu primer instinto es...',
      opciones: [
        { label: 'Analizar los datos paso a paso', perfil: 'analitico' },
        { label: 'Buscar una solución original, fuera de lo común', perfil: 'creativo' },
        { label: 'Pensar qué es lo que realmente funciona, sin vueltas', perfil: 'practico' },
        { label: 'Confiar en lo que "sientes" que es correcto', perfil: 'intuitivo' }
      ]
    },
    {
      texto: 'En un grupo de trabajo, sueles ser quien...',
      opciones: [
        { label: 'Revisa que todo tenga lógica y esté bien fundamentado', perfil: 'analitico' },
        { label: 'Propone ideas nuevas que nadie había pensado', perfil: 'creativo' },
        { label: 'Se asegura de que el plan sea realista y se pueda ejecutar', perfil: 'practico' },
        { label: 'Detecta cómo se siente el grupo, sin que nadie lo diga', perfil: 'intuitivo' }
      ]
    },
    {
      texto: 'Cuando tomas una decisión importante, te apoyas más en...',
      opciones: [
        { label: 'Datos, pros y contras por escrito', perfil: 'analitico' },
        { label: 'Imaginar varios escenarios posibles', perfil: 'creativo' },
        { label: 'Lo que ya te ha funcionado antes', perfil: 'practico' },
        { label: 'Tu corazonada', perfil: 'intuitivo' }
      ]
    },
    {
      texto: 'Tu escritorio o espacio de trabajo ideal es...',
      opciones: [
        { label: 'Ordenado, con todo clasificado', perfil: 'analitico' },
        { label: 'Lleno de notas e ideas sueltas, aunque parezca caos', perfil: 'creativo' },
        { label: 'Con solo lo esencial para ser eficiente', perfil: 'practico' },
        { label: 'Como te haga sentir bien ese día', perfil: 'intuitivo' }
      ]
    },
    {
      texto: 'Si algo no sale como esperabas, tu reacción es...',
      opciones: [
        { label: 'Investigar exactamente qué salió mal', perfil: 'analitico' },
        { label: 'Buscar una forma distinta de intentarlo', perfil: 'creativo' },
        { label: 'Ajustar lo mínimo necesario y seguir adelante', perfil: 'practico' },
        { label: 'Confiar en que algo mejor está por venir', perfil: 'intuitivo' }
      ]
    },
    {
      texto: 'Prefieres leer/ver contenido sobre...',
      opciones: [
        { label: 'Cómo funcionan las cosas, ciencia o datos', perfil: 'analitico' },
        { label: 'Arte, historias o ideas poco convencionales', perfil: 'creativo' },
        { label: 'Guías prácticas y tutoriales', perfil: 'practico' },
        { label: 'Psicología, emociones o desarrollo personal', perfil: 'intuitivo' }
      ]
    }
  ],

  perfiles: {
    analitico: {
      nombre: 'Pensador Analítico',
      descripcion: 'Procesas el mundo a través de datos, lógica y estructura. Tomas mejores decisiones cuando tienes información clara frente a ti.'
    },
    creativo: {
      nombre: 'Pensador Creativo',
      descripcion: 'Conectas ideas de formas que otros no ven. Tu fortaleza es imaginar posibilidades antes de que existan.'
    },
    practico: {
      nombre: 'Pensador Práctico',
      descripcion: 'Vas directo a lo que funciona. No te pierdes en teoría: prefieres resultados concretos y eficientes.'
    },
    intuitivo: {
      nombre: 'Pensador Intuitivo',
      descripcion: 'Confías en tu percepción y en las señales sutiles. Muchas veces sabes algo antes de poder explicar por qué.'
    }
  }
};
