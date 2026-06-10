const Attendance = require('../models/Attendance');
const Usuario = require('../models/User');
const Suscripcion = require('../models/planUsuario');
const { Op } = require('sequelize');
const { generarPalabraDelDia } = require('../jobs/generateDailyCode');

exports.obtenerPalabraDelDia = async (req, res) => {
    try {
        const registro = await generarPalabraDelDia();

        return res.status(200).json({ status: 'success', palabra: registro.palabra });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.registrarAutoAsistencia = async (req, res) => {
    try {
        const { palabraIngresada } = req.body;
        const usuarioId = req.user.id;
        const hoy = new Date().toISOString().split('T')[0];

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario || usuario.estado !== 'activo') {
            return res.status(403).json({ status: 'error', message: 'Tu cuenta esta inactiva. Debes pagar o renovar tu plan primero.' });
        }

        const codigoDia = await generarPalabraDelDia();
        if (!codigoDia || codigoDia.palabra !== palabraIngresada.toUpperCase().trim()) {
            return res.status(400).json({ status: 'error', message: 'La palabra clave del dia es incorrecta.' });
        }

        const suscripcionActiva = await Suscripcion.findOne({
            where: {
                usuarioId,
                estado: 'activo',
                fechaInicio: { [Op.lte]: hoy },
                fechaFin: { [Op.gte]: hoy },
                diasTotalesDisponibles: { [Op.gt]: 0 }
            },
            order: [['fechaFin', 'DESC']]
        });

        if (!suscripcionActiva) {
            return res.status(403).json({ status: 'error', message: 'No tienes una suscripcion activa con dias disponibles.' });
        }

        await Attendance.create({
            usuarioId,
            fecha: hoy,
            tipoRegistro: 'AUTOPROPIO'
        });

        await suscripcionActiva.decrement('diasTotalesDisponibles', { by: 1 });
        await suscripcionActiva.increment('diasAsistidos', { by: 1 });
        await usuario.increment('puntos', { by: 10 });

        return res.status(201).json({ status: 'success', message: 'Asistencia registrada. +10 puntos sumados.' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Ya registraste tu asistencia el dia de hoy.' });
        }
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.registrarAsistenciaPorAdmin = async (req, res) => {
    try {
        const { usuarioId, fechaAsistencia } = req.body;
        const fechaFinal = fechaAsistencia || new Date().toISOString().split('T')[0];

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
        }

        await Attendance.create({
            usuarioId,
            fecha: fechaFinal,
            tipoRegistro: 'MANUAL_ADMIN'
        });

        const suscripcionActiva = await Suscripcion.findOne({
            where: { usuarioId, estado: 'activo' },
            order: [['fechaFin', 'DESC']]
        });

        if (suscripcionActiva) {
            await suscripcionActiva.decrement('diasTotalesDisponibles', { by: 1 });
            await suscripcionActiva.increment('diasAsistidos', { by: 1 });
        }

        await usuario.increment('puntos', { by: 10 });

        return res.status(201).json({ status: 'success', message: 'Asistencia registrada manualmente por el administrador.' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Este usuario ya cuenta con asistencia registrada en esa fecha.' });
        }
        return res.status(500).json({ status: 'error', error: error.message });
    }
};
