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
      vecesPorDia INTEGER NOT NULL,
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
  });
};
