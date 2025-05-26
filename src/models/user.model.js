import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./vida.db");

export const createUser = (nombre, email, hash, callback) => {
  db.run(
    "INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, hash],
    function (err) {
      callback(err, this?.lastID);
    }
  );
};

export const findUserByEmailAndName = (email, nombre, callback) => {
  db.get(
    "SELECT * FROM usuario WHERE email = ? AND nombre = ?",
    [email, nombre],
    (err, user) => {
      callback(err, user);
    }
  );
};

export const findUserById = (id, callback) => {
  db.get(
    "SELECT id, nombre, email FROM usuario WHERE id = ?",
    [id],
    (err, user) => {
      callback(err, user);
    }
  );
};
