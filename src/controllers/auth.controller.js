import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./vida.db");

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hash],
      function (err) {
        if (err) return res.status(500).json(err);

        // Crea el token con el ID del usuario
        const token = createAccessToken({ id: this.lastID });

        // Envía token como cookie segura
        res.cookie("token", token, {
          expiresIn: "7d",
        });

        res.json({
          id: this.lastID,
          username: nombre,
          email: email,
          token: token,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const LogIn = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    db.get(
      "SELECT * FROM usuario WHERE email = ? AND nombre = ?",
      [email, nombre],

      async (err, user) => {
        if (err)
          return res.status(500).json({ message: "Error de base de datos" });
        if (!user)
          return res.status(404).json({ message: "Usuario no encontrado" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
          return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = createAccessToken({ id: user.id });

        res.cookie("token", token, {
          expiresIn: "7d",
        });

        res.json({
          id: user.id,
          username: user.nombre,
          email: user.email,
          token: token,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada correctamente" });
};

export const profile = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "No autorizado" });
  }

  db.get(
    "SELECT id, nombre, email FROM usuario WHERE id = ?",
    [userId],
    (err, user) => {
      if (err)
        return res.status(500).json({ message: "Error de base de datos" });
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    }
  );
};
