import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./vida.db");

export const connectDB = () => {
  db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS datos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER UNIQUE,
      sexo TEXT NOT NULL,
      edad INTEGER NOT NULL,
      peso REAL NOT NULL,
      altura REAL NOT NULL,
      objetivo TEXT,
      duracion TEXT,
      deporte TEXT,
      restricciones TEXT,
      frecuencia TEXT,
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS categoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      Deportes TEXT NOT NULL,
      Condiciones TEXT NOT NULL,
      Edad INTEGER NOT NULL,
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
    );
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS habito (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      nombre TEXT NOT NULL,
      vecesPorDia REAL NOT NULL,
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
    );
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS progreso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitoId INTEGER,
      fecha TEXT NOT NULL,
      FOREIGN KEY (habitoId) REFERENCES habito(id)
    );
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS discapacitado (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER UNIQUE,
      genero TEXT NOT NULL,
      edad INTEGER NOT NULL,
      peso REAL NOT NULL,
      altura REAL NOT NULL,
      objetivo TEXT,
      discapacidad TEXT NOT NULL,
      movilidad TEXT NOT NULL,
      frecuencia TEXT,
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
    )
  `);
  });
};

export const migrateDB = () => {
  db.all("PRAGMA table_info(datos)", (err, columns) => {
    if (err) {
      console.error("Error al obtener info de la tabla datos:", err);
      return;
    }
    const colNames = Array.isArray(columns)
      ? columns.map((col) => col.name)
      : [];
    // Si existe 'fechaNacimiento', rehacer la tabla sin esa columna
    if (colNames.includes("fechaNacimiento")) {
      console.log(
        "Migrando tabla 'datos' para eliminar columna 'fechaNacimiento'..."
      );
      db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS datos_temp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuarioId INTEGER,
          sexo TEXT NOT NULL,
          edad INTEGER NOT NULL,
          peso REAL NOT NULL,
          altura REAL NOT NULL,
          objetivo TEXT,
          duracion TEXT,
          deporte TEXT,
          restricciones TEXT,
          frecuencia TEXT,
          FOREIGN KEY (usuarioId) REFERENCES usuario(id)
        )`);
        db.run(`INSERT INTO datos_temp (id, usuarioId, sexo, edad, peso, altura, objetivo, duracion, deporte, restricciones, frecuencia)
          SELECT id, usuarioId, sexo, edad, peso, altura, objetivo, duracion, deporte, restricciones, frecuencia FROM datos`);
        db.run("DROP TABLE datos");
        db.run("ALTER TABLE datos_temp RENAME TO datos");
        console.log("Columna 'fechaNacimiento' eliminada de la tabla datos");
      });
    }

    // Si usuarioId no es único, rehacer la tabla con restricción UNIQUE
    db.all("PRAGMA index_list(datos)", (err, indexes) => {
      if (err) {
        console.error("Error al obtener índices de la tabla datos:", err);
        return;
      }
      const hasUniqueUsuarioId = Array.isArray(indexes)
        ? indexes.some((idx) => idx.unique && idx.name.includes("usuarioId"))
        : false;
      if (!hasUniqueUsuarioId) {
        console.log(
          "Migrando tabla 'datos' para agregar UNIQUE a usuarioId..."
        );
        db.serialize(() => {
          db.run(`CREATE TABLE IF NOT EXISTS datos_temp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuarioId INTEGER UNIQUE,
            sexo TEXT NOT NULL,
            edad INTEGER NOT NULL,
            peso REAL NOT NULL,
            altura REAL NOT NULL,
            objetivo TEXT,
            duracion TEXT,
            deporte TEXT,
            restricciones TEXT,
            frecuencia TEXT,
            FOREIGN KEY (usuarioId) REFERENCES usuario(id)
          )`);
          db.run(`INSERT OR IGNORE INTO datos_temp (id, usuarioId, sexo, edad, peso, altura, objetivo, duracion, deporte, restricciones, frecuencia)
            SELECT id, usuarioId, sexo, edad, peso, altura, objetivo, duracion, deporte, restricciones, frecuencia FROM datos`);
          db.run("DROP TABLE datos");
          db.run("ALTER TABLE datos_temp RENAME TO datos");
          console.log(
            "Restricción UNIQUE agregada a usuarioId en la tabla datos"
          );
        });
      }
    });
  });
};

// Llama a migrateDB al iniciar
connectDB();
migrateDB();
