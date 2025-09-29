require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
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
  const { nombre, correo, celular } = req.body;

  // Validar que todos los campos estén presentes
  if (!nombre || !correo || !celular) {
    return res.status(400).json({ 
      message: "Todos los campos son requeridos: nombre, correo, celular" 
    });
  }

  try {
    // MODO PRODUCCIÓN: Comentar n8n temporalmente (n8n no disponible en Render)
    console.log(`📝 Datos recibidos en producción: ${nombre} - ${correo} - ${celular}`);
    
    // TODO: Configurar n8n en producción o usar webhook público
    // const n8nResponse = await axios.post('http://localhost:5678/webhook/formulario', {
    //   nombre,
    //   correo,
    //   celular
    // }, {
    //   timeout: 10000,
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

    console.log(`✅ Registro exitoso: ${nombre} - ${correo}`);

    res.status(201).json({ 
      message: "Información registrada exitosamente"
    });
  } catch (error) {
    console.error(`❌ Error al procesar registro de ${nombre}:`, error.message);
    
    // Manejo simplificado de errores
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        message: "Servicio temporalmente no disponible. Inténtalo más tarde." 
      });
    }
    
    if (error.response?.status === 404) {
      return res.status(500).json({ 
        message: "Error de configuración del servicio. Contacta al administrador." 
      });
    }
    
    res.status(500).json({ 
      message: "Error interno del servidor. Inténtalo más tarde." 
    });
  }
});

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en puerto:${port}`);
});

// Endpoints comentados para referencia
// app.get('/subscribers', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM subscribers ORDER BY id DESC');
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error('Error al obtener números:', error);
//     res.status(500).json({ message: 'Error al obtener números' });
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Encárgate API funcionando ✅');
// });
