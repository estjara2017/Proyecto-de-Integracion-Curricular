const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const paymentController = require('../controllers/payment.controller');
const autenticar = require('../middlewares/autenticar');
const esAdmin = require('../middlewares/esAdmin');

router.use(autenticar, esAdmin);

router.get('/clientes', adminController.listarClientes);
router.get('/clientes/asistencia', adminController.listarClientesParaAsistencia);
router.patch('/clientes/:id', adminController.actualizarCliente);
router.delete('/clientes/:id', adminController.eliminarCliente);
router.patch('/usuarios/rol-admin', adminController.asignarRolAdminPorCedula);
router.get('/pagos/pendientes', adminController.listarPagosPendientes);
router.patch('/pagos/aprobar', paymentController.aprobarPagoAdmin);
router.get('/ranking', adminController.obtenerRanking);
router.patch('/clientes/:id/promover', adminController.promoverCliente);
router.get('/rutinas', adminController.listarRutinasAdmin);
router.post('/rutinas', adminController.guardarRutinaAdmin);
router.get('/recursos-nivel', adminController.listarRecursosPorNivel);

module.exports = router;
