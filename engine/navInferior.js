// =========================================================================
// MOTOR: navInferior.js — barra de navegación inferior fija (Capa A).
// Se monta en las pantallas "principales" (Hoy, Juegos, Tests, Perfil).
// NO se usa en onboarding/paywall ni en pantallas inmersivas de juego/test
// (gameIntro, gamePlay, gameResult, testIntro, testPlay, testResult).
// =========================================================================

import router from './router.js';

const PESTANAS = [
  { id: 'hoy', icon: '🏠', label: 'Hoy', ruta: 'home' },
  { id: 'juegos', icon: '🎮', label: 'Juegos', ruta: 'juegos' },
  { id: 'tests', icon: '🧩', label: 'Tests', ruta: 'tests' },
  { id: 'perfil', icon: '👤', label: 'Perfil', ruta: 'perfil' }
];

// Altura reservada para la barra; las pantallas que la usan deben dejar
// este espacio libre abajo (padding-bottom) para que el contenido no quede tapado.
export const ALTO_NAV = 76;

export function montarNav(container, activo) {
  const nav = document.createElement('nav');
  nav.style.position = 'fixed';
  nav.style.left = '0';
  nav.style.right = '0';
  nav.style.bottom = '0';
  nav.style.display = 'flex';
  nav.style.background = 'var(--color-superficie)';
  nav.style.borderTop = '1px solid var(--color-borde)';
  nav.style.paddingBottom = 'env(safe-area-inset-bottom)';
  nav.style.zIndex = '10';

  nav.innerHTML = PESTANAS.map((p) => `
    <button data-ruta="${p.ruta}" style="
      flex:1; background:none; border:none; cursor:pointer;
      display:flex; flex-direction:column; align-items:center; gap:2px;
      padding: 10px 0 8px; font-family: var(--fuente-cuerpo);
      color: ${p.id === activo ? 'var(--color-primario)' : 'var(--color-texto-tenue)'};
    ">
      <span style="font-size:1.3rem; line-height:1;">${p.icon}</span>
      <span style="font-size: var(--txt-xs); font-weight:${p.id === activo ? '700' : '500'};">${p.label}</span>
    </button>
  `).join('');

  container.appendChild(nav);

  nav.querySelectorAll('button').forEach((boton) => {
    boton.addEventListener('click', () => router.ir(boton.dataset.ruta, {}, { reemplazar: true }));
  });
}
