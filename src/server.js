import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = "someSecret"; // Usa un valor más seguro en producción

const app = express();
const db = new sqlite3.Database("./vida.db");

app.use(
  cors({
    origin: true, // Permite cualquier origen
    credentials: true,
  })
);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Crear tabla si no existe
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

app.use(cookieParser());

// Ruta para mostrar perfil del usuario

// Iniciar servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
app.use(express.static("public"));

function authRequired(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

app.get("/", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/LogIn/index.html");
  }

  try {
    jwt.verify(token, SECRET);
    res.sendFile(__dirname + "/public/index.html");
  } catch (err) {
    // If token is invalid or expired
    return res.redirect("/LogIn/index.html");
  }
});
