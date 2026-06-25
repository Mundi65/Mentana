// =========================================================================
// MOTOR: botonAtras.js — flecha discreta para volver a la pantalla anterior.
// Se monta en (casi) todas las pantallas. Si no hay historial (es la
// primera pantalla, ej. Home recién arrancado), no se muestra nada.
// =========================================================================

import router from './router.js';

export function montarBotonAtras(container) {
  if (!router.hayHistorial()) return;

  const boton = document.createElement('button');
  boton.setAttribute('aria-label', 'Atrás');
  boton.textContent = '←';
  boton.style.position = 'fixed';
  boton.style.top = 'max(16px, env(safe-area-inset-top))';
  boton.style.left = '16px';
  boton.style.width = '40px';
  boton.style.height = '40px';
  boton.style.borderRadius = 'var(--radio-pastilla)';
  boton.style.border = '1px solid var(--color-borde)';
  boton.style.background = 'var(--color-superficie)';
  boton.style.color = 'var(--color-texto-tenue)';
  boton.style.fontSize = '1.1rem';
  boton.style.display = 'flex';
  boton.style.alignItems = 'center';
  boton.style.justifyContent = 'center';
  boton.style.cursor = 'pointer';
  boton.style.zIndex = '20';
  boton.style.boxShadow = 'var(--sombra-tarjeta)';

  boton.addEventListener('click', () => router.atras());
  container.appendChild(boton);
}
