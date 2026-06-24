// modals.js — no es una pantalla de ruta completa, sino helpers para mostrar
// ventanas modales (confirmaciones, logro desbloqueado, etc.) sobre cualquier
// pantalla. Se llena conforme se necesiten modales concretos.
export function mostrarModal(contenidoHTML) {
  const fondo = document.createElement('div');
  fondo.style.position = 'fixed';
  fondo.style.inset = '0';
  fondo.style.background = 'rgba(0,0,0,0.5)';
  fondo.style.display = 'flex';
  fondo.style.alignItems = 'center';
  fondo.style.justifyContent = 'center';
  fondo.innerHTML = `<div class="modal">${contenidoHTML}</div>`;
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) fondo.remove();
  });
  document.body.appendChild(fondo);
  return fondo;
}
