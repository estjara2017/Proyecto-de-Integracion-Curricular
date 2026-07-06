# Proyecto de Integracion Curricular

## Variables de entorno

El archivo `backend/.env` contiene credenciales reales y no debe subirse a GitHub.
Usa `backend/.env.example` como plantilla para crear el `.env` local o para
copiar las variables al panel de Hostinger.

Para el envio de codigos OTP por Gmail se requieren estas variables:

```env
EMAIL_USER=tu_correo@gmail.com
EMAIL_FROM_NAME=Elemental Cross Training
EMAIL_PASS=contrasena_de_aplicacion_de_gmail
```

`EMAIL_PASS` debe ser una contrasena de aplicacion de Google, no la contrasena
normal de la cuenta.

## Despliegue en Hostinger

1. Sube el repositorio a GitHub sin archivos `.env`.
2. En Hostinger/Coolify, configura las variables de entorno del backend usando
   los nombres de `backend/.env.example`.
3. Configura `NODE_ENV=production`.
4. Configura `CORS_ORIGIN` en el backend con el dominio publico del frontend.
5. Configura `VITE_API_URL` en el frontend con la URL publica del backend, por
   ejemplo `https://api.elementalcrosstraining.com/api`.
6. Ejecuta la instalacion y build del frontend:

```bash
cd frontend
npm install
npm run build
```

7. Ejecuta el backend con:

```bash
cd backend
npm install
npm start
```

Si usas Docker en el servidor, revisa tambien `docker-compose.yml` y reemplaza
las credenciales de ejemplo por variables seguras del entorno del servidor.

## Dominios de produccion

Con el dominio `elementalcrosstraining.com`, una configuracion recomendada es:

```text
elementalcrosstraining.com      -> pagina principal o redireccion
app.elementalcrosstraining.com  -> frontend React
api.elementalcrosstraining.com  -> backend Express
```

Variables para esa configuracion:

```env
# Backend
CORS_ORIGIN=https://app.elementalcrosstraining.com

# Frontend
VITE_API_URL=https://api.elementalcrosstraining.com/api
```
