import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtén __dirname compatible con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database("./vida.db");

/**
 * Calcula las calorías diarias recomendadas para un usuario dado su userId.
 * Usa los datos de la tabla 'datos' y la lógica de src/datos/calorias.json.
 * @param {number} userId
 * @param {function} callback (err, calorias)
 */
export function calcularCalorias(userId, callback) {
  db.get("SELECT * FROM datos WHERE usuarioId = ?", [userId], (err, datos) => {
    if (err) return callback(err);
    if (!datos)
      return callback(new Error("No se encontraron datos para el usuario."));
    // Cargar el archivo de calorías
    const caloriasPath = path.resolve(__dirname, "../datos/calorias.json");
    fs.readFile(caloriasPath, "utf8", (err, data) => {
      if (err) return callback(err);
      let caloriasJson;
      try {
        caloriasJson = JSON.parse(data);
      } catch (e) {
        return callback(new Error("Error al parsear calorias.json"));
      }
      // Buscar grupo de edad
      const edad = Number(datos.edad);
      const peso = Number(datos.peso);
      const altura = Number(datos.altura);
      const grupos = caloriasJson.grupos_edad;
      let grupo = null;
      for (const g of grupos) {
        const [min, max] = g.rango.split("-").map(Number);
        if (edad >= min && edad <= max) {
          grupo = g;
          break;
        }
      }
      if (!grupo)
        return callback(
          new Error("No hay grupo de edad para la edad especificada.")
        );
      // Calorías base
      let calorias = grupo.calorias_base;
      // Filtro estatura (altura en metros, redondear a 2 decimales)
      let estaturaFactor = 1.0;
      const estaturaFiltros = Object.entries(grupo.estatura_filtro).map(
        ([k, v]) => [parseFloat(k), v]
      );
      estaturaFiltros.sort((a, b) => a[0] - b[0]);
      for (let i = 0; i < estaturaFiltros.length; i++) {
        if (altura <= estaturaFiltros[i][0]) {
          estaturaFactor = estaturaFiltros[i][1];
          break;
        }
      }
      // Filtro peso
      let pesoFactor = 1.0;
      const pesoFiltros = Object.entries(grupo.peso_filtro).map(([k, v]) => [
        parseFloat(k),
        v,
      ]);
      pesoFiltros.sort((a, b) => a[0] - b[0]);
      for (let i = 0; i < pesoFiltros.length; i++) {
        if (peso <= pesoFiltros[i][0]) {
          pesoFactor = pesoFiltros[i][1];
          break;
        }
      }
      // Actividad física: siempre "moderada"
      const actividadFactor = grupo.actividad_fisica["moderada"] || 1.0;
      // Calorías finales
      const caloriasFinal = Math.round(
        calorias * estaturaFactor * pesoFactor * actividadFactor
      );
      callback(null, caloriasFinal);
    });
  });
}

// --- CLI para ES Modules ---
if (
  process.argv[1] ===
  (typeof fileURLToPath !== "undefined"
    ? fileURLToPath(import.meta.url)
    : new URL("", import.meta.url).pathname)
) {
  const userId = process.argv[2];
  if (!userId) {
    console.error("Uso: node src/scripts/calculadora.js <userId>");
    process.exit(1);
  }
  calcularCalorias(userId, (err, calorias) => {
    if (err) {
      console.error("Error:", err.message);
      process.exit(1);
    }
    console.log(
      `Calorías diarias recomendadas para usuario ${userId}: ${calorias}`
    );
    process.exit(0);
  });
}
