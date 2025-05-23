const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      nombre TEXT,
      email TEXT,
      password TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      Deportes TEXT,
      Condiciones TEXT,
      Edad INTEGER,
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS habito (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuarioId INTEGER,
      nombre TEXT,
      vecesPorDia INTEGER,
      FOREIGN KEY (usuarioId) REFERENCES usuario(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS progreso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habitoId INTEGER,
      fecha TEXT,
      FOREIGN KEY (habitoId) REFERENCES habito(id)
    );
  `);
});

app.use(cookieParser());

// rutas de auth
// Ruta para registrar un nuevo usuario
app.post("/api/usuario", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hash],
      function (err) {
        if (err) return res.status(500).json(err);

        // Crea el token con el ID del usuario
        const token = jwt.sign({ id: this.lastID }, SECRET, {
          expiresIn: "7d",
        });

        // Envía token como cookie segura
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          // secure: true, // Activa esto solo si estás en HTTPS
        });

        res.json({ id: this.lastID });
      }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// Ruta para iniciar sesión
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM usuario WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) return res.status(500).json(err);
      if (!user)
        return res.status(401).json({ message: "Usuario no encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        // secure: true,
      });

      res.json({ message: "Inicio de sesión exitoso" });
    }
  );
});

// Ruta para mostrar perfil del usuario
app.get("/api/perfil", (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No autenticado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    const id = decoded.id;

    db.get("SELECT * FROM usuario WHERE id = ?", [id], (err, user) => {
      if (err) return res.status(500).json(err);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(user);
    });
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
});

// Iniciar servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
