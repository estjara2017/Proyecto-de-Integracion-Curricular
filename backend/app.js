// src/app.js (o index.js en la raíz de tu backend)
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importamos el index de modelos que contiene TODAS las relaciones ya estructuradas
const { sequelize } = require('./models/index'); 
const cargarPlanesIniciales = require('./config/initData'); // La semilla

const { iniciarGeneradorPalabraDiaria } = require('./jobs/generateDailyCode');
const installUserNormalizationTrigger = require('./utils/installUserNormalizationTrigger');
const normalizeExistingUsers = require('./utils/normalizeExistingUsers');

// Importamos tus rutas (que solo redirigen tráfico)
const usuarioRoutes = require('./routes/usuarioRoutes');
const paymentRoutes = require('./routes/payment.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const adminRoutes = require('./routes/admin.routes');
const { actualizarEstadosDeMembresias } = require('./controllers/payment.controller');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origen no permitido por CORS'));
    }
}));
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'ok',
            database: 'connected',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            database: 'disconnected',
            message: error.message
        });
    }
});

// Las rutas solo se encargan de asignar los Prefijos de las URLs
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pagos', paymentRoutes);
app.use('/api/asistencias', attendanceRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;
const DB_MAX_RETRIES = Number(process.env.DB_MAX_RETRIES || 30);
const DB_RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS || 5000);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const syncDatabaseWithRetry = async () => {
    for (let intento = 1; intento <= DB_MAX_RETRIES; intento += 1) {
        try {
            await sequelize.authenticate();
            await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
            return;
        } catch (error) {
            console.error(`Intento ${intento}/${DB_MAX_RETRIES}: PostgreSQL no esta listo.`, error.message);

            if (intento === DB_MAX_RETRIES) {
                throw error;
            }

            await delay(DB_RETRY_DELAY_MS);
        }
    }
};

// Sincronización con PostgreSQL al encender el contenedor
syncDatabaseWithRetry()
    .then(async () => {
        console.log('PostgreSQL conectado y relaciones mapeadas con éxito.');
        
        // Ejecutamos la semilla aquí, justo después de sincronizar las tablas
        await installUserNormalizationTrigger();
        await cargarPlanesIniciales();
        await normalizeExistingUsers();
        await actualizarEstadosDeMembresias();
        iniciarGeneradorPalabraDiaria();
        
        app.listen(PORT, () => {
            console.log(`Servidor de Elemental corriendo en el puerto ${PORT}`);
        });
    })
    .catch(error => console.error('Error al iniciar la base de datos:', error));
