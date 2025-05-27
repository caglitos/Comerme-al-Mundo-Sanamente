document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/profile");
    if (response.ok) {
      const user = await response.json();
      const profileElement = document.getElementById("profile");
      if (profileElement && user) {
        // Si el usuario tiene nombre, lo muestra; si no, muestra 'Sin nombre'
        const nombre = user.nombre ? user.nombre : "Sin nombre";
        profileElement.textContent = `Nombre: ${nombre}, Email: ${user.email}`;
      } else if (!user) {
        console.error("User data not found in response");
      } else if (!profileElement) {
        console.error("Profile element not found in HTML");
      }
    } else if (response.status === 401) {
      // Not authenticated, perhaps redirect to login or do nothing if already on login page
      console.log("User not authenticated. Not fetching profile.");
      // No need to redirect from here, server.js handles main page protection
    } else {
      console.error("Error fetching profile:", response.statusText);
    }
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
  }
});
