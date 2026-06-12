// src/routes/attendance.routes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const autenticar = require('../middlewares/autenticar'); // Middleware JWT para Clientes
const esAdmin = require('../middlewares/esAdmin');     // Middleware para verificar rol de Coach

// Ruta que consulta el cliente al escanear el QR en /attendance
router.get('/palabra-dia', attendanceController.obtenerPalabraDelDia);
router.get('/qr-activo', [autenticar, esAdmin], attendanceController.obtenerQrActivo);

// Acción del botón flotante en el panel del usuario
router.post('/auto-registro', autenticar, attendanceController.registrarAutoAsistencia);

// Acción del botón del Coach en el panel de administración
router.post('/registro-manual', [autenticar, esAdmin], attendanceController.registrarAsistenciaPorAdmin);

module.exports = router;
