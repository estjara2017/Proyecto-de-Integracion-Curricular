const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const autenticar = require('../middlewares/autenticar');
const esAdmin = require('../middlewares/esAdmin');

router.get('/planes/:planId/resumen', paymentController.obtenerResumenPlan);
router.get('/planes', paymentController.listarPlanes);
router.get('/mi-membresia', autenticar, paymentController.obtenerMiMembresia);
router.post('/notificar', autenticar, paymentController.notificarPagoSuscripcion);
router.patch('/aprobar', [autenticar, esAdmin], paymentController.aprobarPagoAdmin);

module.exports = router;
