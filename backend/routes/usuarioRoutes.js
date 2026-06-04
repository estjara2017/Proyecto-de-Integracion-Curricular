// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de registro (Formulario de la captura)
router.post('/register', authController.registrarUsuario);

// Rutas de Login sin contraseña (Ventana /attendance)
router.post('/login-request', authController.solicitarOtp); // Envía el OTP al correo
router.post('/login-verify', authController.verificarOtp);   // Valida el OTP y da acceso

module.exports = router;