const boxes = document.querySelectorAll('.slide-box');

function updateAnimations() {
  boxes.forEach(box => {
    const rect = box.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const startOffset = 0.2; // Inicia animación cuando el 20% del elemento está cerca del viewport
    const endOffset = 0.8;   // Termina animación cuando el 80% del elemento está visible

    // Calcula el progreso (0 a 1) basado en la posición del scroll
    const progress = Math.min(1, Math.max(0, (rect.top - viewportHeight * startOffset) / (viewportHeight * (startOffset - endOffset)));

    // Aplica transformación según dirección
    const direction = box.dataset.direction;
    if (direction === "left") {
      box.style.transform = `translateX(${-100 + (progress * 100)}%)`;
    } else {
      box.style.transform = `translateX(${100 - (progress * 100)}%)`;
    }
  });
}

window.addEventListener('scroll', updateAnimations);
window.addEventListener('resize', updateAnimations);
updateAnimations(); // Inicializar