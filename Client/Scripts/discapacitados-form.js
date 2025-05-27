// Script para manejar el formulario de discapacitados

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("discapacitados-form");
  if (!form) return;

  let usuarioId = null;

  // Obtener el usuarioId antes de permitir enviar el formulario
  fetch("/api/profile", { credentials: "include" })
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
    // Obtén los valores de los campos
    const genero = document.getElementById("genero-disc").value;
    const edad = document.getElementById("edad-disc").value;
    const peso = document.getElementById("peso-disc").value;
    const altura = document.getElementById("altura-disc").value;
    const objetivo = document.getElementById("objetivo-disc").value;
    const discapacidad = document.getElementById("discapacidad-disc").value;
    const movilidad = document.getElementById("movilidad-disc").value;
    const frecuencia = document.getElementById("frecuencia-disc").value;

    // Construye el objeto de datos
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
      const response = await fetch(`/api/discapacitado/${usuarioId}`, {
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
        console.log("Respuesta de error backend:", result);
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
