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
router.patch('/usuarios/rol-admin', adminController.asignarRolAdminPorCorreo);
router.get('/pagos/pendientes', paymentController.listarPagosPendientesAdmin);
router.patch('/pagos/aprobar', paymentController.aprobarPagoAdmin);
router.patch('/pagos/rechazar', paymentController.rechazarPagoAdmin);
router.get('/ranking', adminController.obtenerRanking);
router.patch('/clientes/:id/promover', adminController.promoverCliente);
router.patch('/clientes/:id/descender', adminController.descenderCliente);
router.get('/rutinas', adminController.listarRutinasAdmin);
router.post('/rutinas', adminController.guardarRutinaAdmin);
router.delete('/rutinas/:id', adminController.eliminarRutinaAdmin);
router.get('/recursos-nivel', adminController.listarRecursosPorNivel);
router.post('/recursos-nivel', adminController.guardarRecursoNivel);
router.delete('/recursos-nivel/:id', adminController.eliminarRecursoNivel);

module.exports = router;
