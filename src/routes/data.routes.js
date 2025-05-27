import { Router } from "express";
import { authRequiered } from "../middlewares/validateToken.js";
import {
  getAllCategoriasByUser,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getAllDatosByUser,
  getDatosByID,
  createDatos,
  updateDatos,
  deleteDatos,
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
  createDiscapacitado,
  getDiscapacitadoByUser,
} from "../controllers/data.controller.js";
import { calcularCalorias } from "../scripts/calculadora.js";

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

// Datos
router.get("/datos/:usuarioId", authRequiered, getAllDatosByUser);
router.get("/dato/:usuarioId/:datoId", authRequiered, getDatosByID);
router.post("/dato/:usuarioId", authRequiered, (req, res) => {
  const usuarioId = req.params.usuarioId;
  const datos = req.body;
  createDatos(usuarioId, datos, (err, lastID) => {
    if (err) {
      // Always send a clear error message
      return res.status(500).json({
        message: err.message || "Error en la base de datos",
        error: err,
      });
    }
    res
      .status(201)
      .json({ id: lastID, message: "Datos creados correctamente" });
  });
});
router.put("/dato/:usuarioId/:datoId", authRequiered, updateDatos);
router.delete("/dato/:usuarioId/:datoId", authRequiered, deleteDatos);

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

// Discapacitado
router.post("/discapacitado/:usuarioId", authRequiered, (req, res) => {
  createDiscapacitado(req.params.usuarioId, req.body, (err, lastID) => {
    if (err)
      return res.status(500).json({
        message: err.message || "Error en la base de datos",
        error: err,
      });
    res.json({ id: lastID });
  });
});
router.get("/discapacitado/:usuarioId", authRequiered, (req, res) => {
  getDiscapacitadoByUser(req.params.usuarioId, (err, row) => {
    if (err)
      return res.status(500).json({
        message: err.message || "Error en la base de datos",
        error: err,
      });
    if (!row) return res.status(404).json({ message: "No encontrado" });
    res.json(row);
  });
});

// Calorías recomendadas
router.get("/calorias/:usuarioId", authRequiered, (req, res) => {
  const usuarioId = req.params.usuarioId;
  calcularCalorias(usuarioId, (err, calorias) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "Error al calcular calorías",
        error: err,
      });
    }
    res.json({ calorias });
  });
});

export default router;
