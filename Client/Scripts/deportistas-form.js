document.addEventListener("DOMContentLoaded", () => {
  console.log("Script deportistas-form.js cargado");
  const form = document.getElementById("deportistas-form");
  if (!form) return;

  let usuarioId = null;

  // Obtener el usuarioId antes de permitir enviar el formulario
  fetch("../api/auth/profile", { credentials: "include" })
    .then((res) => res.json())
    .then((user) => {
      usuarioId = user.id;
    })
    .catch(() => {
      alert("No autenticado. Por favor inicia sesión.");
      form.querySelector("button[type='submit']").disabled = true;
    })
    .catch((error) => console.log(error));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      alert("No autenticado. Por favor inicia sesión.");
      return;
    }
    // Obtén los valores de los campos
    const genero = document.getElementById("sexo").value;
    const edad = document.getElementById("edad").value;
    const peso = document.getElementById("peso").value;
    const altura = document.getElementById("altura").value;
    const objetivo = document.getElementById("objetivo").value;
    const duracion = document.getElementById("duracion").value;
    const deporte = document.getElementById("deporte").value;
    const restricciones = document.getElementById("restricciones").value;
    const frecuencia = document.getElementById("frecuencia").value;

    // Construye el objeto de datos
    const data = {
      genero,
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
      console.log(requestAnimationFrame.body);
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
        console.log("Respuesta de error backend:", result); // <-- para depuración
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
});
