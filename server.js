const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const db = new sqlite3.Database('./vida.db')

// Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS habito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    vecesPorDia INTEGER
  )
`)

// Ruta para guardar hábito
app.post('/api/habito', (req, res) => {
  const { nombre, vecesPorDia } = req.body
  db.run('INSERT INTO habito (nombre, vecesPorDia) VALUES (?, ?)', [nombre, vecesPorDia], function (err) {
    if (err) return res.status(500).json(err)
    res.json({ id: this.lastID })
  })
})

// Ruta para mostrar hábitos
app.get('/api/habitos', (req, res) => {
  db.all('SELECT * FROM habito', (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

// Iniciar servidor
app.listen(3000, () => console.log('Servidor en http://localhost:3000'))
