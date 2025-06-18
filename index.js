require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // ← Esto es lo importante
  },
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    await pool.query("INSERT INTO subscribers (email) VALUES ($1)", [email]);
    res.status(201).json({ message: "Correo registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el correo:", error); // agrega esto
    res.status(500).json({ message: "Error al registrar el correo", error: error.message });
  }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.get('/subscribers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subscribers ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener suscriptores:', error);
        res.status(500).json({ message: 'Error al obtener suscriptores' });
    }
});

app.get('/', (req, res) => {
  res.send('Encárgate API funcionando ✅');
});

