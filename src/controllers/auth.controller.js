import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import {
  createUser,
  findUserByEmailAndName,
  findUserById,
} from "../models/user.model.js";

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    createUser(nombre, email, hash, async (err, lastID) => {
      if (err) return res.status(500).json(err);
      const token = await createAccessToken({ id: lastID });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({ id: lastID, username: nombre, email: email, token: token });
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    findUserByEmailAndName(email, nombre, async (err, user) => {
      if (err)
        return res.status(500).json({ message: "Error de base de datos" });
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Contraseña incorrecta" });
      const token = await createAccessToken({ id: user.id });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      res.json({
        id: user.id,
        username: user.nombre,
        email: user.email,
        token,
      });
    });
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
  findUserById(userId, (err, user) => {
    if (err) return res.status(500).json({ message: "Error de base de datos" });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  });
};
