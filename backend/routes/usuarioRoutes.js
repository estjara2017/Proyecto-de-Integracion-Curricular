const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');
const autenticar = require('../middlewares/autenticar');

router.post('/register', authController.registrarUsuario);
router.post('/registrar', authController.registrarUsuario);

router.post('/login-request', authController.solicitarOtp);
router.post('/login-verify', authController.verificarOtp);
router.post('/login/solicitar-otp', authController.solicitarOtp);
router.post('/login/verificar-otp', authController.verificarOtp);

router.get('/me', autenticar, authController.obtenerPerfil);
router.patch('/me/avatar', autenticar, authController.actualizarAvatar);
router.patch('/me/horario', autenticar, authController.actualizarHorario);
router.get('/ranking', autenticar, authController.obtenerRanking);
router.get('/me/rutinas', autenticar, authController.obtenerRutinasDelNivel);

module.exports = router;
