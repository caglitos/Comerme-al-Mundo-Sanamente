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

function mostrarDatos() {
  db.all("SELECT * FROM datos", (err, rows) => {
    if (err) {
      console.error("Error al obtener datos:", err);
    } else {
      console.log("Datos:", rows);
    }
  });
}

function eliminarDatos() {
  db.run("DELETE FROM datos", function (err) {
    if (err) {
      console.error("Error al eliminar datos:", err);
    } else {
      console.log("Todos los datos han sido eliminados.");
    }
  });
}

function mostrarCategorias() {
  db.all("SELECT * FROM categoria", (err, rows) => {
    if (err) {
      console.error("Error al obtener categorias:", err);
    } else {
      console.log("Categorias:", rows);
    }
  });
}

function eliminarCategorias() {
  db.run("DELETE FROM categoria", function (err) {
    if (err) {
      console.error("Error al eliminar categorias:", err);
    } else {
      console.log("Todas las categorias han sido eliminadas.");
    }
  });
}

function mostrarHabitos() {
  db.all("SELECT * FROM habito", (err, rows) => {
    if (err) {
      console.error("Error al obtener habitos:", err);
    } else {
      console.log("Habitos:", rows);
    }
  });
}

function eliminarHabitos() {
  db.run("DELETE FROM habito", function (err) {
    if (err) {
      console.error("Error al eliminar habitos:", err);
    } else {
      console.log("Todos los habitos han sido eliminados.");
    }
  });
}

function mostrarProgresos() {
  db.all("SELECT * FROM progreso", (err, rows) => {
    if (err) {
      console.error("Error al obtener progresos:", err);
    } else {
      console.log("Progresos:", rows);
    }
  });
}

function eliminarProgresos() {
  db.run("DELETE FROM progreso", function (err) {
    if (err) {
      console.error("Error al eliminar progresos:", err);
    } else {
      console.log("Todos los progresos han sido eliminados.");
    }
  });
}

function mostrarDiscapacitados() {
  db.all("SELECT * FROM discapacitado", (err, rows) => {
    if (err) {
      console.error("Error al obtener discapacitados:", err);
    } else {
      console.log("Discapacitados:", rows);
    }
  });
}

function eliminarDiscapacitados() {
  db.run("DELETE FROM discapacitado", function (err) {
    if (err) {
      console.error("Error al eliminar discapacitados:", err);
    } else {
      console.log("Todos los discapacitados han sido eliminados.");
    }
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar() {
  rl.question(
    `Elige una opción:\n` +
      `1: mostrar usuarios\n2: eliminar usuarios\n` +
      `3: mostrar datos\n4: eliminar datos\n` +
      `5: mostrar categorias\n6: eliminar categorias\n` +
      `7: mostrar habitos\n8: eliminar habitos\n` +
      `9: mostrar progresos\n10: eliminar progresos\n` +
      `11: mostrar discapacitados\n12: eliminar discapacitados\n` +
      `13: salir\n> `,
    (opcion) => {
      switch (opcion) {
        case "1":
          mostrarUsuarios();
          break;
        case "2":
          eliminarUsuarios();
          break;
        case "3":
          mostrarDatos();
          break;
        case "4":
          eliminarDatos();
          break;
        case "5":
          mostrarCategorias();
          break;
        case "6":
          eliminarCategorias();
          break;
        case "7":
          mostrarHabitos();
          break;
        case "8":
          eliminarHabitos();
          break;
        case "9":
          mostrarProgresos();
          break;
        case "10":
          eliminarProgresos();
          break;
        case "11":
          mostrarDiscapacitados();
          break;
        case "12":
          eliminarDiscapacitados();
          break;
        case "13":
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
