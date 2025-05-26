import { Router } from "express";
import { authRequiered } from "../middlewares/validateToken.js";
import {
  getAllCategoriasByUser,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getAllHabitosByUser,
  getHabitoById,
  createHabito,
  updateHabito,
  deleteHabito,
  getAllProgresosByHabito,
  getProgresoById,
  createProgreso,
  updateProgreso,
  deleteProgreso,
} from "../controllers/data.controller.js";

const router = Router();

// Categorías
router.get("/categorias/:usuarioId", authRequiered, getAllCategoriasByUser);
router.get(
  "/categoria/:usuarioId/:categoriaId",
  authRequiered,
  getCategoriaById
);
router.post("/categoria/:usuarioId", authRequiered, createCategoria);
router.put(
  "/categoria/:usuarioId/:categoriaId",
  authRequiered,
  updateCategoria
);
router.delete(
  "/categoria/:usuarioId/:categoriaId",
  authRequiered,
  deleteCategoria
);

// Hábitos
router.get("/habitos/:usuarioId", authRequiered, getAllHabitosByUser);
router.get("/habito/:usuarioId/:habitoId", authRequiered, getHabitoById);
router.post("/habito/:usuarioId", authRequiered, createHabito);
router.put("/habito/:usuarioId/:habitoId", authRequiered, updateHabito);
router.delete("/habito/:usuarioId/:habitoId", authRequiered, deleteHabito);

// Progresos
router.get("/progresos/:habitoId", authRequiered, getAllProgresosByHabito);
router.get("/progreso/:habitoId/:progresoId", authRequiered, getProgresoById);
router.post("/progreso/:habitoId", authRequiered, createProgreso);
router.put("/progreso/:habitoId/:progresoId", authRequiered, updateProgreso);
router.delete("/progreso/:habitoId/:progresoId", authRequiered, deleteProgreso);

export default router;
