// script.js
// este script funciona para enviar los datos de los formularios de registro y login al backend
const enter = document.getElementById("Lpassword");
enter.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Evitar el comportamiento predeterminado del Enter
    sendLoginData(); // Llamar a la función para enviar los datos de inicio de sesión
  }
});
const enter2 = document.getElementById("RconfirmPassword");
enter2.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Evitar el comportamiento predeterminado del Enter
    sendRegisterData(); // Llamar a la función para enviar los datos de registro
  }
});

// Función para enviar los datos del formulario de registro
function sendRegisterData() {
  // Obtener los valores de los campos del formulario
  const username = document.getElementById("Rusername").value.trim();
  const password = document.getElementById("Rpassword").value.trim();
  const passwordConfirm = document
    .getElementById("RconfirmPassword")
    .value.trim();
  const email = document.getElementById("Remail").value.trim().toLowerCase();

  if (!username || !password || !email) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  if (password !== passwordConfirm) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  // Crear un objeto con los datos del formulario
  const data = {
    nombre: username, // El backend espera 'nombre', no 'username'
    password: password,
    email: email,
  };

  // Enviar los datos al backend usando fetch
  fetch("./../api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Importante para cookies
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);

      window.location.href = "./../index.html"; // Redirigir a la página de inicio
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Función para enviar los datos del formulario de inicio de sesión
function sendLoginData() {
  const email = document.getElementById("Lemail").value;
  const password = document.getElementById("Lpassword").value;

  fetch("./../api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "./../index.html"; // Redirigir a la página de inicio
      } else {
        alert("Error en el inicio de sesión");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
