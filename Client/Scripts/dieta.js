async function getCaloriasYMenu() {
  let usuarioId = null;
  try {
    const profileRes = await fetch("./../api/auth/profile", {
      credentials: "include",
    });
    if (profileRes.ok) {
      const user = await profileRes.json();
      usuarioId = user.id;
    }
  } catch (e) {}
  if (!usuarioId) {
    document.querySelector(
      ".calorias"
    ).innerHTML = `Debes <a href="../LogIn" style="color: blue; text-decoration: underline" >iniciar sesión</a> para ver tus calorías recomendadas.`;
    return;
  }
  let calorias = null;
  let datosDisc = null;
  let esDiscapacitado = false;
  // 1. Intenta como deportista (tabla datos)
  try {
    const res = await fetch(`./../api/data/calorias/${usuarioId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("No datos deportista");
    calorias = (await res.json()).calorias;
    document.querySelector(
      ".calorias"
    ).textContent = `Debes consumir aproximadamente ${calorias} calorías diarias.`;
  } catch (e) {
    // 2. Si no hay datos de deportista, intenta como discapacitado
    try {
      const resDisc = await fetch(`./../api/data/discapacitado/${usuarioId}`, {
        credentials: "include",
      });
      if (!resDisc.ok) throw new Error("No datos discapacitado");
      datosDisc = await resDisc.json();
      // Calcula calorías con los datos disponibles (ignora deportes, factor 1)
      // Suponiendo que el backend responde con los campos: genero, edad, peso, altura
      const { genero, edad, peso, altura } = datosDisc;
      if (!genero || !edad || !peso || !altura) {
        document.querySelector(".calorias").textContent =
          "No hay suficientes datos para calcular las calorías.";
        return;
      }
      // Fórmula Harris-Benedict simplificada
      let tmb;
      if (genero === "masculino") {
        tmb = 66.47 + 13.75 * peso + 5.003 * altura - 6.755 * edad;
      } else {
        tmb = 655.1 + 9.563 * peso + 1.85 * altura - 4.676 * edad;
      }
      calorias = Math.round(tmb * 1); // factor actividad = 1
      esDiscapacitado = true;
      document.querySelector(
        ".calorias"
      ).textContent = `Debes consumir aproximadamente ${calorias} calorías diarias.`;
    } catch (e2) {
      document.querySelector(".calorias").textContent =
        "No se pudieron calcular las calorías. Completa tu formulario primero.";
      return;
    }
  }
  let dietasJson;
  try {
    const dietasRes = await fetch("/dietas.json");
    dietasJson = await dietasRes.json();
  } catch (e) {
    document.querySelector(".calorias").textContent =
      "No se pudo cargar el menú de dietas.";
    return;
  }
  const dietas = dietasJson.dietas;
  let dietaCercana = dietas[0];
  let minDiff = Math.abs(dietas[0].calorias - calorias);
  for (const d of dietas) {
    const diff = Math.abs(d.calorias - calorias);
    if (diff < minDiff) {
      minDiff = diff;
      dietaCercana = d;
    }
  }
  // Si es discapacitado, puedes mostrar un mensaje extra o adaptar la dieta si lo deseas
  if (esDiscapacitado) {
    document.querySelector(".calorias").textContent +=
      " (Dieta calculada para discapacitado)";
  }
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  const semana = Math.floor(Date.now() / 1000 / 60 / 60 / 24 / 7);
  function getMenuAlternativa(arr, diaIdx) {
    if (!arr || arr.length === 0) return "Sin menú";
    return arr[(diaIdx + semana) % arr.length];
  }
  const tipos = ["desayuno", "almuerzo", "cena"];
  tipos.forEach((tipo, tipoIdx) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    tr.appendChild(th);
    for (let dia = 0; dia < 7; dia++) {
      const td = document.createElement("td");
      const menu = getMenuAlternativa(dietaCercana[tipo], dia);
      td.innerHTML = `<button class='ver-menu' data-menu="${menu.replace(
        /"/g,
        "&quot;"
      )}">Ver menú</button>`;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  // Popup estilizado
  let popup = document.getElementById("menu-popup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "menu-popup";
    popup.style.display = "none";
    popup.innerHTML = `<div class='popup-content'><span class='close-popup'>&times;</span><div class='popup-text'></div></div>`;
    document.body.appendChild(popup);
    // Estilos rápidos (puedes mover a dieta.css)
    const style = document.createElement("style");
    style.textContent = `
      #menu-popup {
        position: fixed; 
        left: 0; 
        top: 0; 
        width: 100vw; 
        height: 100vh;
        background: rgba(0,0,0,0.4); 
        z-index: 9999; 
        display: flex; 
        align-items: center; 
        justify-content: center;
      }
      #menu-popup .popup-content {
        background:rgb(195, 255, 155); 
        padding: 2rem; 
        border-radius: 1rem; 
        border: 2px solid black;
        min-width: 250px; 
        max-width: 90vw; 
        box-shadow: 0 2px 16px #0005;
        position: relative;
      }
      #menu-popup .close-popup {
        position: absolute; 
        top: 0.5rem; 
        right: 1rem; 
        font-size: 2rem; 
        cursor: pointer; 
        color: #ff0000;
      }
      #menu-popup .popup-text {
        font-size: 1.2rem; 
        color: #222; 
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }
    `;
    document.head.appendChild(style);
  }
  function showPopup(text) {
    popup.querySelector(".popup-text").textContent = text;
    popup.style.display = "flex";
  }
  function hidePopup() {
    popup.style.display = "none";
  }
  popup.querySelector(".close-popup").onclick = hidePopup;
  popup.onclick = function (e) {
    if (e.target === popup) hidePopup();
  };
  tbody.querySelectorAll(".ver-menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      showPopup(btn.dataset.menu);
    });
  });
}
document.addEventListener("DOMContentLoaded", getCaloriasYMenu);
