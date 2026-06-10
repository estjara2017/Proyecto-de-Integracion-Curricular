const { Plan, Suscripcion, Pago, Usuario } = require('../models/index');

const calcularDiasEntrenamiento = (plan) => {
    if (plan.duracionDias <= 7) return plan.duracionDias;
    return Math.ceil((plan.duracionDias / 7) * plan.diasPorSemana);
};

exports.listarPlanes = async (req, res) => {
    try {
        const planes = await Plan.findAll({ order: [['id', 'ASC']] });
        return res.status(200).json({ status: 'success', data: planes });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.obtenerResumenPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findByPk(planId);

        if (!plan) return res.status(404).json({ status: 'error', message: 'Plan no encontrado.' });

        return res.status(200).json({
            status: 'success',
            data: {
                planId: plan.id,
                nombre: plan.nombre,
                precio: plan.precio,
                duracionDias: plan.duracionDias,
                diasPorSemana: plan.diasPorSemana,
                diasTotalesDeEntrenamiento: calcularDiasEntrenamiento(plan)
            }
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.notificarPagoSuscripcion = async (req, res) => {
    try {
        const { planId, metodoPago } = req.body;
        const usuarioId = req.user.id;

        const plan = await Plan.findByPk(planId);
        if (!plan) return res.status(404).json({ status: 'error', message: 'Plan no encontrado.' });

        const nuevaSuscripcion = await Suscripcion.create({
            usuarioId,
            planId: plan.id,
            estado: 'pendiente',
            diasTotalesDisponibles: calcularDiasEntrenamiento(plan),
            diasAsistidos: 0
        });

        await Pago.create({
            suscripcionId: nuevaSuscripcion.id,
            monto: plan.precio,
            estado: 'pendiente',
            metodoPago: metodoPago || 'Transferencia'
        });

        return res.status(201).json({
            status: 'success',
            message: 'Pago notificado. El administrador activara tu plan tras verificar la transferencia.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.aprobarPagoAdmin = async (req, res) => {
    try {
        const { pagoId } = req.body;

        const pago = await Pago.findByPk(pagoId, { include: { model: Suscripcion, include: [Plan] } });
        if (!pago) return res.status(404).json({ status: 'error', message: 'Registro de pago no encontrado.' });
        if (pago.estado === 'aprobado') return res.status(400).json({ status: 'error', message: 'Este pago ya fue aprobado previamente.' });

        pago.estado = 'aprobado';
        await pago.save();

        const suscripcion = pago.Suscripcion;
        const hoy = new Date();
        const fechaFinCalculada = new Date(hoy);
        fechaFinCalculada.setDate(hoy.getDate() + suscripcion.Plan.duracionDias);

        suscripcion.fechaInicio = hoy.toISOString().split('T')[0];
        suscripcion.fechaFin = fechaFinCalculada.toISOString().split('T')[0];
        suscripcion.estado = 'activo';
        await suscripcion.save();

        await Usuario.update({ estado: 'activo' }, { where: { id: suscripcion.usuarioId } });

        return res.status(200).json({
            status: 'success',
            message: 'Pago aprobado. Suscripcion y cuenta del cliente activas.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};
