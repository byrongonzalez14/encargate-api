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
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email requerido' });

    try {
        await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
        res.status(200).json({ message: 'Correo registrado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al registrar el correo' });
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

