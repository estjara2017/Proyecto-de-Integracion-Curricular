const { Op } = require('sequelize');
const { Plan, Suscripcion, Pago, Usuario } = require('../models/index');

const PENDING_PAYMENT_TTL_MS = 24 * 60 * 60 * 1000;

const calcularDiasEntrenamiento = (plan) => {
    if (plan.duracionDias <= 7) return plan.duracionDias;
    return Math.ceil((plan.duracionDias / 7) * plan.diasPorSemana);
};

const sumarDias = (fecha, dias) => {
    const resultado = new Date(fecha);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
};

const normalizarFecha = (fecha) => new Date(`${fecha}T00:00:00`);

const diasEntre = (desde, hasta) => {
    const msPorDia = 24 * 60 * 60 * 1000;
    return Math.ceil((normalizarFecha(hasta) - normalizarFecha(desde)) / msPorDia);
};

const construirEstadoMembresia = (suscripcion, hoy) => {
    if (!suscripcion) {
        return {
            estado: 'sin_plan',
            mensaje: 'No tienes un plan activo. Selecciona un plan para solicitar tu activacion.'
        };
    }

    const plan = suscripcion.Plan;
    const diasRestantes = suscripcion.fechaFin ? Math.max(diasEntre(hoy, suscripcion.fechaFin), 0) : null;
    const diasDisponibles = Number(suscripcion.diasTotalesDisponibles || 0);

    if (suscripcion.estado === 'pendiente') {
        return {
            estado: 'pendiente',
            suscripcion,
            plan,
            diasRestantes,
            diasDisponibles,
            mensaje: 'Tu solicitud de plan esta pendiente de aprobacion por administracion.'
        };
    }

    if (suscripcion.estado === 'activo' && diasRestantes !== null && diasRestantes <= 5) {
        return {
            estado: 'por_vencer',
            suscripcion,
            plan,
            diasRestantes,
            diasDisponibles,
            mensaje: `Tu plan ${plan?.nombre || ''} termina en ${diasRestantes} dia(s). Renueva para no perder el acceso.`
        };
    }

    if (suscripcion.estado === 'activo' && diasDisponibles <= 2) {
        return {
            estado: 'pocos_dias',
            suscripcion,
            plan,
            diasRestantes,
            diasDisponibles,
            mensaje: `Te quedan ${diasDisponibles} asistencia(s) disponibles. Considera renovar tu plan.`
        };
    }

    if (suscripcion.estado === 'activo') {
        return {
            estado: 'activo',
            suscripcion,
            plan,
            diasRestantes,
            diasDisponibles,
            mensaje: 'Tu plan esta activo.'
        };
    }

    return {
        estado: suscripcion.estado || 'vencido',
        suscripcion,
        plan,
        diasRestantes,
        diasDisponibles,
        mensaje: 'Tu ultimo plan vencio. Puedes renovar desde la seccion de planes.'
    };
};

const obtenerFechaLimitePendiente = () => new Date(Date.now() - PENDING_PAYMENT_TTL_MS);

const expirarPagosPendientesVencidos = async () => {
    const fechaLimite = obtenerFechaLimitePendiente();

    const pagosVencidos = await Pago.findAll({
        where: {
            estado: 'pendiente',
            fechaNotificacion: { [Op.lt]: fechaLimite }
        },
        include: [Suscripcion]
    });

    for (const pago of pagosVencidos) {
        pago.estado = 'expirado';
        await pago.save();

        if (pago.Suscripcion && pago.Suscripcion.estado === 'pendiente') {
            pago.Suscripcion.estado = 'expirado';
            await pago.Suscripcion.save();
        }
    }
};

const cancelarSolicitudesPendientesDelUsuario = async (usuarioId, estado = 'reemplazado') => {
    const suscripcionesPendientes = await Suscripcion.findAll({
        where: { usuarioId, estado: 'pendiente' },
        include: [{ model: Pago, where: { estado: 'pendiente' }, required: false }]
    });

    for (const suscripcion of suscripcionesPendientes) {
        suscripcion.estado = estado;
        await suscripcion.save();

        for (const pago of suscripcion.Pagos || []) {
            pago.estado = estado;
            await pago.save();
        }
    }
};

exports.actualizarEstadosDeMembresias = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const haceTresMeses = sumarDias(new Date(), -90).toISOString().split('T')[0];

    await Suscripcion.update(
        { estado: 'vencido' },
        {
            where: {
                estado: 'activo',
                [Op.or]: [
                    { fechaFin: { [Op.lt]: hoy } },
                    { diasTotalesDisponibles: { [Op.lte]: 0 } }
                ]
            }
        }
    );

    const usuarios = await Usuario.findAll({ where: { estado: 'activo' } });

    for (const usuario of usuarios) {
        const suscripcionVigente = await Suscripcion.findOne({
            where: {
                usuarioId: usuario.id,
                estado: { [Op.in]: ['activo', 'pendiente'] }
            }
        });

        if (suscripcionVigente) continue;

        const ultimaSuscripcion = await Suscripcion.findOne({
            where: { usuarioId: usuario.id },
            order: [['fechaFin', 'DESC'], ['updatedAt', 'DESC']]
        });

        if (ultimaSuscripcion?.fechaFin && ultimaSuscripcion.fechaFin <= haceTresMeses) {
            await usuario.update({ estado: 'inactivo' });
        }
    }
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

exports.obtenerMiMembresia = async (req, res) => {
    try {
        await exports.actualizarEstadosDeMembresias();
        await expirarPagosPendientesVencidos();

        const hoy = new Date().toISOString().split('T')[0];
        const usuarioId = req.user.id;
        const suscripcion = await Suscripcion.findOne({
            where: { usuarioId },
            include: [Plan],
            order: [
                ['estado', 'ASC'],
                ['fechaFin', 'DESC'],
                ['updatedAt', 'DESC']
            ]
        });

        return res.status(200).json({
            status: 'success',
            data: construirEstadoMembresia(suscripcion, hoy)
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.notificarPagoSuscripcion = async (req, res) => {
    try {
        const { planId, metodoPago } = req.body;
        const usuarioId = req.user.id;

        await expirarPagosPendientesVencidos();
        await cancelarSolicitudesPendientesDelUsuario(usuarioId);

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

exports.listarPagosPendientesAdmin = async (req, res) => {
    try {
        await expirarPagosPendientesVencidos();

        const pagos = await Pago.findAll({
            where: { estado: 'pendiente' },
            include: [{
                model: Suscripcion,
                where: { estado: 'pendiente' },
                include: [Usuario, Plan]
            }],
            order: [['fechaNotificacion', 'ASC']]
        });

        return res.status(200).json({ status: 'success', data: pagos });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.aprobarPagoAdmin = async (req, res) => {
    try {
        const { pagoId } = req.body;

        await expirarPagosPendientesVencidos();

        const pago = await Pago.findByPk(pagoId, { include: { model: Suscripcion, include: [Plan] } });
        if (!pago) return res.status(404).json({ status: 'error', message: 'Registro de pago no encontrado.' });
        if (pago.estado === 'aprobado') return res.status(400).json({ status: 'error', message: 'Este pago ya fue aprobado previamente.' });
        if (pago.estado !== 'pendiente' || pago.Suscripcion?.estado !== 'pendiente') {
            return res.status(400).json({ status: 'error', message: 'Esta solicitud ya no esta pendiente o fue reemplazada.' });
        }
        if (new Date(pago.fechaNotificacion) < obtenerFechaLimitePendiente()) {
            pago.estado = 'expirado';
            await pago.save();
            pago.Suscripcion.estado = 'expirado';
            await pago.Suscripcion.save();
            return res.status(400).json({ status: 'error', message: 'Esta solicitud expiro tras 24 horas. El cliente debe enviar una nueva solicitud.' });
        }

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

exports.rechazarPagoAdmin = async (req, res) => {
    try {
        const { pagoId } = req.body;

        const pago = await Pago.findByPk(pagoId, { include: Suscripcion });
        if (!pago) return res.status(404).json({ status: 'error', message: 'Registro de pago no encontrado.' });
        if (pago.estado !== 'pendiente') {
            return res.status(400).json({ status: 'error', message: 'Solo se pueden rechazar solicitudes pendientes.' });
        }

        pago.estado = 'rechazado';
        await pago.save();

        if (pago.Suscripcion && pago.Suscripcion.estado === 'pendiente') {
            pago.Suscripcion.estado = 'rechazado';
            await pago.Suscripcion.save();
        }

        return res.status(200).json({
            status: 'success',
            message: 'Solicitud rechazada. El cliente puede enviar una nueva solicitud de plan.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};
