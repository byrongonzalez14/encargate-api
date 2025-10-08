# Encárgate API

API backend para el formulario de registro de Encárgate. Envía los datos directamente a n8n, que los guarda en Google Sheets.

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# Configuración del servidor
PORT=3001

# URL del webhook de n8n en AWS
N8N_WEBHOOK_URL=http://52.15.152.242:5678/webhook/formulario
```

### 3. Ejecutar el servidor

**Desarrollo:**
```bash
node index.js
```

**Producción:**
```bash
NODE_ENV=production node index.js
```

## Endpoints

### POST /subscribe
Registra un nuevo suscriptor y envía los datos a n8n.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "celular": "3001234567"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Información registrada exitosamente",
  "n8nStatus": 200
}
```

## Configuración de n8n

1. Asegúrate de que n8n esté corriendo en tu servidor AWS EC2
2. El webhook debe estar configurado en el path `/webhook/formulario`
3. El workflow debe estar **activado** en n8n
4. Verifica que el puerto 5678 esté abierto en el security group de AWS
5. El workflow de n8n debe tener:
   - **Webhook trigger** que recibe: `nombre`, `correo`, `celular`
   - **Google Sheets node** que guarda los datos en tu hoja de cálculo

## Despliegue

Antes de subir a GitHub:
- ✅ El archivo `.env` está en `.gitignore` (no se subirá)
- ✅ Usa `.env.example` como plantilla
- ✅ Configura las variables de entorno en tu servidor de producción

## Troubleshooting

### Error: timeout of 30000ms exceeded
- Verifica que n8n esté corriendo: `http://52.15.152.242:5678`
- Verifica que el workflow esté activado
- Verifica el security group de AWS permite tráfico en el puerto 5678

### Error: ECONNREFUSED
- n8n no está corriendo o no es accesible
- Verifica la URL del webhook en el archivo `.env`
