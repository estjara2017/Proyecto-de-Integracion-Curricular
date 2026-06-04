const { Plan, Suscripcion, Pago, Usuario } = require('../models/index');

// 1. OBTENER INFORMACIÓN DEL PLAN SELECCIONADO (Para renderizar tu componente de la imagen)
exports.obtenerResumenPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findByPk(planId);

        if (!plan) return res.status(404).json({ status: 'error', message: 'Plan no encontrado' });

        // Cálculo exacto de días útiles de entrenamiento
        const semanasPorMes = 4.34; 
        const diasTotales = Math.ceil(plan.meses * semanasPorMes * plan.diasPorSemana);

        return res.status(200).json({
            status: 'success',
            data: {
                planId: plan.id,
                nombre: plan.nombre,
                precio: plan.precio,
                diasPorSemana: plan.diasPorSemana,
                diasTotalesDeEntrenamiento: diasTotales // Esto es lo que viaja a tu vista
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

// 2. NOTIFICAR AL ADMINISTRADOR (Botón "YA TRANSFERÍ")
exports.notificarPagoSuscripcion = async (req, res) => {
    try {
        const { planId } = req.body;
        const usuarioId = req.user.id; // Viene de tu middleware 'autenticar'

        const plan = await Plan.findByPk(planId);
        if (!plan) return res.status(404).json({ status: 'error', message: 'Plan no encontrado' });

        const semanasPorMes = 4.34;
        const diasTotales = Math.ceil(plan.meses * semanasPorMes * plan.diasPorSemana);

        // Crear la suscripción en estado latente (sin fechas de vigencia aún porque no está pagada)
        const nuevaSuscripcion = await Suscripcion.create({
            usuarioId,
            planId: plan.id,
            diasTotalesDisponibles: diasTotales,
            diasAsistidos: 0
        });

        // Registrar el pago pendiente
        await Pago.create({
            suscripcionId: nuevaSuscripcion.id,
            monto: plan.precio,
            estado: 'pendiente'
        });

        return res.status(201).json({
            status: 'success',
            message: 'Pago notificado. El administrador activará tu plan tras verificar la transferencia de Deuna.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

// 3. ACCIÓN DEL ADMINISTRADOR: APROBAR PAGO Y ACTIVAR CUENTA
exports.aprobarPagoAdmin = async (req, res) => {
    try {
        const { pagoId } = req.body;

        const pago = await Pago.findByPk(pagoId, { include: { model: Suscripcion, include: [Plan] } });
        if (!pago) return res.status(404).json({ status: 'error', message: 'Registro de pago no encontrado' });

        if (pago.estado === 'aprobado') return res.status(400).json({ message: 'Este pago ya fue aprobado previamente.' });

        // Actualizar estado del pago
        pago.estado = 'aprobado';
        await pago.save();

        // Calcular vigencia real desde el día de hoy
        const suscripcion = pago.Suscripcion;
        const hoy = new Date();
        const fechaFinCalculada = new Date();
        fechaFinCalculada.setMonth(hoy.getMonth() + suscripcion.Plan.meses);

        suscripcion.fechaInicio = hoy.toISOString().split('T')[0];
        suscripcion.fechaFin = fechaFinCalculada.toISOString().split('T')[0];
        await suscripcion.save();

        // Cambiar el estado del Usuario a 'activo' para habilitar su código QR de asistencia
        await Usuario.update(
            { estado: 'activo' },
            { where: { id: suscripcion.usuarioId } }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Pago aprobado. Suscripción y cuenta del cliente activas.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};