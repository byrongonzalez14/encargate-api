require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/formulario';

app.use(cors());
app.use(express.json());


app.post("/subscribe", async (req, res) => {
  const { nombre, correo, celular } = req.body;

  // Validar que todos los campos estén presentes
  if (!nombre || !correo || !celular) {
    return res.status(400).json({ 
      message: "Todos los campos son requeridos: nombre, correo, celular" 
    });
  }

  try {
    // Enviar datos al webhook de n8n
    console.log(`📝 Enviando datos a n8n: ${nombre} - ${correo} - ${celular}`);
    console.log(`🔗 URL del webhook: ${n8nWebhookUrl}`);
    
    const n8nResponse = await axios.post(n8nWebhookUrl, {
      nombre,
      correo,
      celular
    }, {
      timeout: 30000, // Aumentado a 30 segundos para conexiones externas
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Respuesta de n8n:`, n8nResponse.status, n8nResponse.data);

    res.status(201).json({ 
      message: "Información registrada exitosamente",
      n8nStatus: n8nResponse.status
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

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Encárgate API funcionando ✅',
    n8nConfigured: !!process.env.N8N_WEBHOOK_URL
  });
});

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en puerto:${port}`);
    console.log(`🔗 Webhook n8n configurado: ${n8nWebhookUrl}`);
});
