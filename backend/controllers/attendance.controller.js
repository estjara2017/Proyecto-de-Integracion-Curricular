const Attendance = require('../models/Attendance');
const Usuario = require('../models/User');
const Suscripcion = require('../models/planUsuario');
const AttendanceQrToken = require('../models/AttendanceQrToken');
const { Op } = require('sequelize');
const crypto = require('crypto');

const PALABRAS_QR = [
    'WOD', 'BURPEE', 'AMRAP', 'THRUSTER', 'SNATCH',
    'CLEAN', 'JERK', 'SQUAT', 'ROW', 'BIKE',
    'BOXJUMP', 'KETTLEBELL', 'PULLUP', 'DEADLIFT', 'EMOM',
    'HOLLOW', 'WALLBALL', 'DOUBLEUNDER', 'LUNGE', 'PLANK'
];

const obtenerFinDelDiaEcuador = () => {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Guayaquil',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());

    const fecha = Object.fromEntries(partes.map((parte) => [parte.type, parte.value]));
    return new Date(Date.UTC(Number(fecha.year), Number(fecha.month) - 1, Number(fecha.day) + 1, 4, 59, 59, 999));
};

const elegirPalabraQr = (palabraAnterior = null) => {
    const opciones = PALABRAS_QR.filter((palabra) => palabra !== palabraAnterior);
    return opciones[Math.floor(Math.random() * opciones.length)];
};

const generarTokenQr = async ({ forzarNuevo = false } = {}) => {
    const ahora = new Date();
    const tokenActivo = await AttendanceQrToken.findOne({
        where: { expiraEn: { [Op.gt]: ahora } },
        order: [['expiraEn', 'DESC']]
    });

    if (tokenActivo && !forzarNuevo) return tokenActivo;

    await AttendanceQrToken.destroy({ where: { expiraEn: { [Op.lte]: ahora } } });
    if (forzarNuevo) {
        await AttendanceQrToken.destroy({ where: { expiraEn: { [Op.gt]: ahora } } });
    }

    const token = crypto.randomBytes(18).toString('hex');
    const palabra = elegirPalabraQr(tokenActivo?.palabra);
    const expiraEn = obtenerFinDelDiaEcuador();

    return AttendanceQrToken.create({ token, palabra, expiraEn });
};

const validarTokenQr = async (token) => {
    if (!token) return null;

    return AttendanceQrToken.findOne({
        where: {
            token,
            expiraEn: { [Op.gt]: new Date() }
        }
    });
};

exports.obtenerQrActivo = async (req, res) => {
    try {
        const registro = await generarTokenQr();

        return res.status(200).json({
            status: 'success',
            token: registro.token,
            palabra: registro.palabra,
            expiraEn: registro.expiraEn
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.generarNuevoQr = async (req, res) => {
    try {
        const registro = await generarTokenQr({ forzarNuevo: true });

        return res.status(201).json({
            status: 'success',
            token: registro.token,
            palabra: registro.palabra,
            expiraEn: registro.expiraEn
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.obtenerPalabraDelDia = async (req, res) => {
    try {
        const { qr } = req.query;
        const registro = await validarTokenQr(qr);

        if (!registro) {
            return res.status(403).json({
                status: 'error',
                message: 'Escanea el QR vigente del local para ver la palabra clave.'
            });
        }

        return res.status(200).json({ status: 'success', palabra: registro.palabra });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.registrarAutoAsistencia = async (req, res) => {
    try {
        const { palabraIngresada, qrToken } = req.body;
        const usuarioId = req.user.id;
        const hoy = new Date().toISOString().split('T')[0];

        const qrValido = await validarTokenQr(qrToken);
        if (!qrValido) {
            return res.status(403).json({
                status: 'error',
                message: 'Primero escanea el QR vigente del local e ingresa la palabra clave.'
            });
        }

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario || usuario.estado !== 'activo') {
            return res.status(403).json({ status: 'error', message: 'Tu cuenta esta inactiva. Debes pagar o renovar tu plan primero.' });
        }

        if (qrValido.palabra !== palabraIngresada.toUpperCase().trim()) {
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
