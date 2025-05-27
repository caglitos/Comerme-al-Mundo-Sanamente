// Script para mostrar las calorías recomendadas en la página de Dieta

document.addEventListener("DOMContentLoaded", async () => {
  // Intenta obtener el usuario autenticado
  let usuarioId = null;
  try {
    const profileRes = await fetch("/api/profile", { credentials: "include" });
    if (profileRes.ok) {
      const user = await profileRes.json();
      usuarioId = user.id;
    }
  } catch (e) {
    // No autenticado
  }
  if (!usuarioId) {
    document.querySelector(".calorias").textContent = "Debes iniciar sesión para ver tus calorías recomendadas.";
    return;
  }
  // Pide las calorías al backend
  try {
    const res = await fetch(`/api/calorias/${usuarioId}`, { credentials: "include" });
    if (!res.ok) {
      const data = await res.json();
      document.querySelector(".calorias").textContent = data.message || "No se pudieron calcular las calorías.";
      return;
    }
    const { calorias } = await res.json();
    document.querySelector(".calorias").textContent = `Debes consumir aproximadamente ${calorias} calorías diarias.`;
  } catch (e) {
    document.querySelector(".calorias").textContent = "Error al obtener las calorías.";
  }
});
