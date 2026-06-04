// src/app.js (o index.js en la raíz de tu backend)
const express = require('express');
const cors = require('cors');

// Importamos el index de modelos que contiene TODAS las relaciones ya estructuradas
const { sequelize } = require('./models/index'); 
const cargarPlanesIniciales = require('./config/initData'); // La semilla

const generarPalabraDelDia = require('./jobs/generateDailyCode');

// Importamos tus rutas (que solo redirigen tráfico)
const usuarioRoutes = require('./routes/usuarioRoutes');
const paymentRoutes = require('./routes/payment.routes');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Las rutas solo se encargan de asignar los Prefijos de las URLs
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pagos', paymentRoutes);
app.use('/api/asistencias', attendanceRoutes);

const PORT = process.env.PORT || 4000;

// Sincronización con PostgreSQL al encender el contenedor
sequelize.sync({ alter: true })
    .then(async () => {
        console.log('PostgreSQL conectado y relaciones mapeadas con éxito.');
        
        // Ejecutamos la semilla aquí, justo después de sincronizar las tablas
        await cargarPlanesIniciales(); 
        
        app.listen(PORT, () => {
            console.log(`Servidor de Elemental corriendo en el puerto ${PORT}`);
        });
    })
    .catch(error => console.error('Error al iniciar la base de datos:', error));