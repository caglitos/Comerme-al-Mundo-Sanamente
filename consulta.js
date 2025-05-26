import sqlite3 from "sqlite3";
import readline from "readline";

const db = new sqlite3.Database("./vida.db");

function mostrarUsuarios() {
  db.all("SELECT * FROM usuario", (err, rows) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
    } else {
      console.log("Usuarios:", rows);
    }
  });
}

function eliminarUsuarios() {
  db.run("DELETE FROM usuario", function (err) {
    if (err) {
      console.error("Error al eliminar usuarios:", err);
    } else {
      console.log("Todos los usuarios han sido eliminados.");
    }
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar() {
  rl.question(
    "Elige una opción (1: mostrar usuarios, 2: eliminar usuarios, 3: salir): ",
    (opcion) => {
      switch (opcion) {
        case "1":
          mostrarUsuarios();
          break;
        case "2":
          eliminarUsuarios();
          break;
        case "3":
          rl.close();
          setTimeout(() => db.close(), 500);
          return;
        default:
          console.log("Opción no válida");
      }
      setTimeout(preguntar, 500); // Espera a que termine la operación antes de volver a preguntar
    }
  );
}

do {
  preguntar();
} while (rl.listenerCount("close") === 0);
