require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "encargate_registro_user",
  host: "dpg-d19eckvdiees73asgl0g-a.oregon-postgres.render.com",
  database: "encargate_registro",
  password: "ztsUEWKE4HfDvBnDqnX902pEJYRPYLQy",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.post("/subscribe", async (req, res) => {
  const { phone } = req.body;

  try {
    await pool.query("INSERT INTO subscribers (phone) VALUES ($1)", [phone]);
    res.status(201).json({ message: "Número registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar el número:", error);
    res.status(500).json({ message: "Error al registrar el número", error: error.message });
  }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto:${port}`);
});

app.get('/subscribers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscribers ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener números:', error);
    res.status(500).json({ message: 'Error al obtener números' });
  }
});

app.get('/', (req, res) => {
  res.send('Encárgate API funcionando ✅');
});

