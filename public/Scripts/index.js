import { getProfile } from "../../server";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const user = await getProfile();
    const profileElement = document.getElementById("profile");
    if (profileElement && user) {
      profileElement.textContent = `Nombre: ${user.name}, Email: ${user.email}`;
    }
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
  }
});
