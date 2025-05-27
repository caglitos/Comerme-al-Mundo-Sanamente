const boxes = document.querySelectorAll(".slide-box");

function updateAnimations() {
  boxes.forEach((box) => {
    const rect = box.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const startOffset = 0.2; // Inicia animación cuando el 20% del elemento está cerca del viewport
    const endOffset = 0.8; // Termina animación cuando el 80% del elemento está visible

    // Calcula el progreso (0 a 1) basado en la posición del scroll
    const progress = Math.min(
      1,
      Math.max(0, rect.top - viewportHeight * startOffset) /
        (viewportHeight * (startOffset - endOffset))
    );

    // Aplica transformación según dirección
    const direction = box.dataset.direction;
    if (direction === "left") {
      box.style.transform = `translateX(${-100 + progress * 100}%)`;
    } else {
      box.style.transform = `translateX(${100 - progress * 100}%)`;
    }
  });
}

const discapacitados = () => {
  const discapacitadosForm = document.getElementById("deportistas");

  discapacitadosForm.style.minHeight = "auto";
  discapacitadosForm.style.padding = "10vh";

  discapacitadosForm.innerHTML = `
  <h2>Contesta formulario Discapacitados</h2>
        <form id="discapacitados-form">
          <label for="genero-disc">Género:</label>
          <select name="genero" id="genero-disc" required>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <input
            type="number"
            name="edad"
            id="edad-disc"
            placeholder="Edad"
            required
          />
          <input
            type="number"
            name="peso"
            id="peso-disc"
            placeholder="Peso (kg)"
            step="0.1"
            required
          />
          <input
            type="number"
            name="altura"
            id="altura-disc"
            placeholder="Altura (cm)"
            required
          />
          <input
            type="text"
            name="objetivo"
            id="objetivo-disc"
            placeholder="Objetivo"
          />
          <input
            type="text"
            name="discapacidad"
            id="discapacidad-disc"
            placeholder="Discapacidad"
            required
          />
          <input
            type="text"
            name="movilidad"
            id="movilidad-disc"
            placeholder="Movilidad"
            required
          />
          <input
            type="text"
            name="frecuencia"
            id="frecuencia-disc"
            placeholder="Frecuencia"
          />
          <button type="submit">Enviar</button>
        </form>
        `;
};

const deportistas = () => {
  const deportistasForm = document.getElementById("deportistas");

  deportistasForm.style.minHeight = "auto";
  deportistasForm.style.padding = "10vh";

  deportistasForm.innerHTML = `
    <h2>Contesta formulario Deportistas</h2>
      <form id="deportistas-form">
        <label for="sexo">Sexo:</label>
        <select name="sexo" id="sexo" required>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
        <input
          type="number"
          name="edad"
          id="edad"
          placeholder="Edad"
          required
        />
        <input
          type="number"
          name="peso"
          id="peso"
          placeholder="Peso (kg)"
          step="0.1"
          required
        />
        <input
          type="number"
          name="altura"
          id="altura"
          placeholder="Altura (cm)"
          required
        />
        <input
          type="text"
          name="objetivo"
          id="objetivo"
          placeholder="Objetivo"
        />
        <input
          type="text"
          name="duracion"
          id="duracion"
          placeholder="Duración"
        />
        <select name="deporte" id="deporte">
          <option value="futbol">Fútbol</option>
          <option value="basket">Baloncesto</option>
          <option value="tenis">Tenis</option>
          <option value="otro">Otro</option>
        </select>
        <input
          type="text"
          name="restricciones"
          id="restricciones"
          placeholder="Restricciones"
        />
        <input
          type="text"
          name="frecuencia"
          id="frecuencia"
          placeholder="Frecuencia"
        />
        <button type="submit">Enviar</button>
      </form>
  `;
};

window.addEventListener("scroll", updateAnimations);
window.addEventListener("resize", updateAnimations);
updateAnimations(); // Inicializar
