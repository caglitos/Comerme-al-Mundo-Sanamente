const boxes = document.querySelectorAll(".slide-box");

function updateAnimations() {
  boxes.forEach((box) => {
    const rect = box.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const startOffset = 0.2;
    const endOffset = 0.8;
    const progress = Math.min(
      1,
      Math.max(0, rect.top - viewportHeight * startOffset) /
        (viewportHeight * (startOffset - endOffset))
    );
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
          <label for="sexo-disc">Sexo:</label>
          <select name="sexo" id="sexo-disc" required>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <input type="number" name="edad" id="edad-disc" placeholder="Edad" required />
          <input type="number" name="peso" id="peso-disc" placeholder="Peso (kg)" step="0.1" required />
          <input type="number" name="altura" id="altura-disc" placeholder="Altura (cm)" required />
          <input type="text" name="objetivo" id="objetivo-disc" placeholder="Objetivo" />
          <input type="text" name="discapacidad" id="discapacidad-disc" placeholder="Discapacidad" required />
          <input type="text" name="movilidad" id="movilidad-disc" placeholder="Movilidad" required />
          <input type="text" name="frecuencia" id="frecuencia-disc" placeholder="Frecuencia" />
          <button id="enviar-disc" type="submit">Enviar</button>
        </form>
        `;

  // --- Lógica de envío del formulario discapacitados ---
  const form = document.getElementById("discapacitados-form");
  if (!form) return;

  let usuarioId = null;

  fetch("../api/auth/profile", { credentials: "include" })
    .then((res) => res.json())
    .then((user) => {
      usuarioId = user.id;
    })
    .catch(() => {
      alert("No autenticado. Por favor inicia sesión.");
      form.querySelector("button[type='submit']").disabled = true;
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      alert("No autenticado. Por favor inicia sesión.");
      return;
    }
    const genero = document.getElementById("sexo-disc").value;
    const edad = document.getElementById("edad-disc").value;
    const peso = document.getElementById("peso-disc").value;
    const altura = document.getElementById("altura-disc").value;
    const objetivo = document.getElementById("objetivo-disc").value;
    const discapacidad = document.getElementById("discapacidad-disc").value;
    const movilidad = document.getElementById("movilidad-disc").value;
    const frecuencia = document.getElementById("frecuencia-disc").value;

    const data = {
      genero,
      edad: parseInt(edad, 10),
      peso: parseFloat(peso),
      altura: parseInt(altura, 10),
      objetivo,
      discapacidad,
      movilidad,
      frecuencia,
    };

    try {
      const response = await fetch(`/api/data/discapacitado/${usuarioId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      if (response.ok) {
        alert("Datos enviados correctamente");
        form.reset();
      } else {
        alert(
          "Error al enviar datos: " +
            (result.message ||
              JSON.stringify(result, null, 2) ||
              response.status)
        );
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
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
        <input type="number" name="edad" id="edad" placeholder="Edad (años)" required />
        <input type="number" name="peso" id="peso" placeholder="Peso (kg)" step="0.1" required />
        <input type="number" name="altura" id="altura" placeholder="Altura (cm)" required />
        <input type="text" name="objetivo" id="objetivo" placeholder="Objetivo (imc = peso/altura^2)" />
        <input type="text" name="duracion" id="duracion" placeholder="Duración (horas)" />
        <select name="deporte" id="deporte">
          <option value="artes-marciales">Artes Marciales</option>
          <option value="atletismo">Atletismo</option>
          <option value="basket">Baloncesto</option>
          <option value="boxeo">Boxeo</option>
          <option value="ciclismo">Ciclismo</option>
          <option value="escalada">Escalada</option>
          <option value="futbol">Fútbol</option>
          <option value="gimnasia">Gimnasia</option>
          <option value="hockey">Hockey</option>
          <option value="natacion">Natación</option>
          <option value="pesas">Pesas</option>
          <option value="snowboard">Snowboard</option>
          <option value="tenis">Tenis</option>
          <option value="voleibol">Voleibol</option>
          <option value="otro">Otro</option>
        </select>
        <input type="text" name="restricciones" id="restricciones" placeholder="Restricciones" />
        <input type="text" name="frecuencia" id="frecuencia" placeholder="Frecuencia" />
        <button id="enviar" type="submit">Enviar</button>
      </form>
  `;

  // --- Lógica de envío del formulario ---
  const form = document.getElementById("deportistas-form");
  if (!form) return;

  let usuarioId = null;

  fetch("../api/auth/profile", { credentials: "include" })
    .then((res) => res.json())
    .then((user) => {
      usuarioId = user.id;
    })
    .catch(() => {
      alert("No autenticado. Por favor inicia sesión.");
      form.querySelector("button[type='submit']").disabled = true;
    });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      alert("No autenticado. Por favor inicia sesión.");
      return;
    }
    const sexo = document.getElementById("sexo").value;
    const edad = document.getElementById("edad").value;
    const peso = document.getElementById("peso").value;
    const altura = document.getElementById("altura").value;
    const objetivo = document.getElementById("objetivo").value;
    const duracion = document.getElementById("duracion").value;
    const deporte = document.getElementById("deporte").value;
    const restricciones = document.getElementById("restricciones").value;
    const frecuencia = document.getElementById("frecuencia").value;

    const data = {
      sexo,
      edad: parseInt(edad, 10),
      peso: parseFloat(peso),
      altura: parseInt(altura, 10),
      objetivo,
      duracion,
      deporte,
      restricciones,
      frecuencia,
    };

    try {
      const response = await fetch(`/api/data/dato/${usuarioId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      if (response.ok) {
        alert("Datos enviados correctamente");
        form.reset();
      } else {
        alert(
          "Error al enviar datos: " +
            (result.message ||
              JSON.stringify(result, null, 2) ||
              response.status)
        );
      }
    } catch (error) {
      alert("Error de red: " + error.message);
    }
  });
};

window.addEventListener("scroll", updateAnimations);
window.addEventListener("resize", updateAnimations);
updateAnimations(); // Inicializar
