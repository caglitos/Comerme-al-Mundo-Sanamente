import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./vida.db");

// --------- CATEGORIA ---------
export function getAllCategoriasByUser(usuarioId, callback) {
  db.all(
    "SELECT * FROM categoria WHERE usuarioId = ?",
    [usuarioId],
    (err, rows) => callback(err, rows)
  );
}

export function getCategoriaById(usuarioId, categoriaId, callback) {
  db.get(
    "SELECT * FROM categoria WHERE id = ? AND usuarioId = ?",
    [categoriaId, usuarioId],
    (err, row) => callback(err, row)
  );
}

export function createCategoria(
  usuarioId,
  { Deportes, Condiciones, Edad },
  callback
) {
  if (!Deportes || !Condiciones || !Edad) {
    return callback({ message: "Todos los campos son obligatorios" });
  }
  db.run(
    "INSERT INTO categoria (usuarioId, Deportes, Condiciones, Edad) VALUES (?, ?, ?, ?)",
    [usuarioId, Deportes, Condiciones, Edad],
    function (err) {
      callback(err, this?.lastID);
    }
  );
}

export function updateCategoria(
  usuarioId,
  categoriaId,
  { Deportes, Condiciones, Edad },
  callback
) {
  db.run(
    "UPDATE categoria SET Deportes = ?, Condiciones = ?, Edad = ? WHERE id = ? AND usuarioId = ?",
    [Deportes, Condiciones, Edad, categoriaId, usuarioId],
    function (err) {
      callback(err, this?.changes);
    }
  );
}

export function deleteCategoria(usuarioId, categoriaId, callback) {
  db.run(
    "DELETE FROM categoria WHERE id = ? AND usuarioId = ?",
    [categoriaId, usuarioId],
    function (err) {
      callback(err, this?.changes);
    }
  );
}

// --------- HABITO ---------
export function getAllHabitosByUser(usuarioId, callback) {
  db.all("SELECT * FROM habito WHERE usuarioId = ?", [usuarioId], (err, rows) =>
    callback(err, rows)
  );
}

export function getHabitoById(usuarioId, habitoId, callback) {
  db.get(
    "SELECT * FROM habito WHERE id = ? AND usuarioId = ?",
    [habitoId, usuarioId],
    (err, row) => callback(err, row)
  );
}

export function createHabito(usuarioId, { nombre, vecesPorDia }, callback) {
  if (!nombre || !vecesPorDia) {
    return callback({ message: "Todos los campos son obligatorios" });
  }
  db.run(
    "INSERT INTO habito (usuarioId, nombre, vecesPorDia) VALUES (?, ?, ?)",
    [usuarioId, nombre, vecesPorDia],
    function (err) {
      callback(err, this?.lastID);
    }
  );
}

export function updateHabito(
  usuarioId,
  habitoId,
  { nombre, vecesPorDia },
  callback
) {
  db.run(
    "UPDATE habito SET nombre = ?, vecesPorDia = ? WHERE id = ? AND usuarioId = ?",
    [nombre, vecesPorDia, habitoId, usuarioId],
    function (err) {
      callback(err, this?.changes);
    }
  );
}

export function deleteHabito(usuarioId, habitoId, callback) {
  db.run(
    "DELETE FROM habito WHERE id = ? AND usuarioId = ?",
    [habitoId, usuarioId],
    function (err) {
      callback(err, this?.changes);
    }
  );
}

// --------- PROGRESO ---------
export function getAllProgresosByHabito(habitoId, callback) {
  db.all("SELECT * FROM progreso WHERE habitoId = ?", [habitoId], (err, rows) =>
    callback(err, rows)
  );
}

export function getProgresoById(habitoId, progresoId, callback) {
  db.get(
    "SELECT * FROM progreso WHERE id = ? AND habitoId = ?",
    [progresoId, habitoId],
    (err, row) => callback(err, row)
  );
}

export function createProgreso(habitoId, { fecha }, callback) {
  if (!fecha) {
    return callback({ message: "El campo fecha es obligatorio" });
  }
  db.run(
    "INSERT INTO progreso (habitoId, fecha) VALUES (?, ?)",
    [habitoId, fecha],
    function (err) {
      callback(err, this?.lastID);
    }
  );
}

export function updateProgreso(habitoId, progresoId, { fecha }, callback) {
  db.run(
    "UPDATE progreso SET fecha = ? WHERE id = ? AND habitoId = ?",
    [fecha, progresoId, habitoId],
    function (err) {
      callback(err, this?.changes);
    }
  );
}

export function deleteProgreso(habitoId, progresoId, callback) {
  db.run(
    "DELETE FROM progreso WHERE id = ? AND habitoId = ?",
    [progresoId, habitoId],
    function (err) {
      callback(err, this?.changes);
    }
  );
}
