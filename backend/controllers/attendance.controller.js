// src/controllers/attendance.controller.js
const Attendance = require('../models/Attendance');
const DailyCode = require('../models/DailyCode');
const Usuario = require('../models/User');
const Suscripcion = require('../models/planUsuario'); // Tu modelo intermedio de planes

// 1. OBTENER PALABRA DEL DÍA (Pública para la pestaña /attendance)
exports.obtenerPalabraDelDia = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const registro = await DailyCode.findOne({ where: { fecha: hoy } });

        if (!registro) {
            return res.status(404).json({ status: 'error', message: 'Palabra del día no disponible' });
        }

        return res.status(200).json({ status: 'success', palabra: registro.palabra });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

// 2. AUTO-REGISTRO DEL ATLETA (Ingresando la palabra clave en la alerta)
exports.registrarAutoAsistencia = async (req, res) => {
    try {
        const { palabraIngresada } = req.body;
        const usuarioId = req.user.id; // Obtenido del middleware de autenticación por Token
        const hoy = new Date().toISOString().split('T')[0];

        // A. Validar que el usuario esté ACTIVO (que haya pagado su suscripción)
        const usuario = await Usuario.findByPk(usuarioId);
        if (usuario.estado !== 'activo') {
            return res.status(403).json({ status: 'error', message: 'Tu cuenta está inactiva. Debes pagar o renovar tu plan primero.' });
        }

        // B. Validar la palabra clave del día
        const codigoDia = await DailyCode.findOne({ where: { fecha: hoy } });
        if (!codigoDia || codigoDia.palabra !== palabraIngresada.toUpperCase().trim()) {
            return res.status(400).json({ status: 'error', message: 'La palabra clave del día es incorrecta.' });
        }

        // C. Registrar asistencia en Postgres
        await Attendance.create({
            usuarioId,
            fecha: hoy,
            tipoRegistro: 'AUTOPROPIO'
        });

        // D. Restar un día disponible en su suscripción activa e incrementar asistidos
        const suscripcionActiva = await Suscripcion.findOne({
            where: { usuarioId, id: usuario.suscripcionActivaId } // Asumiendo que guardas cuál es su plan vigente
        });
        
        if (suscripcionActiva) {
            await suscripcionActiva.decrement('diasTotalesDisponibles', { by: 1 });
            await suscripcionActiva.increment('diasAsistidos', { by: 1 });
        }

        // E. Opcional: Sumar puntos para el Leaderboard de competencia
        await usuario.increment('puntos', { by: 10 }); 

        return res.status(201).json({ status: 'success', message: '¡Asistencia registrada! +10 puntos sumados.' });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Ya registraste tu asistencia el día de hoy.' });
        }
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

// 3. REGISTRO MANUAL POR EL ADMINISTRADOR (Botón de auxilio en panel Admin)
exports.registrarAsistenciaPorAdmin = async (req, res) => {
    try {
        const { usuarioId, fechaAsistencia } = req.body; // El Admin elige a qué cliente y qué día (por defecto hoy)
        const fechaFinal = fechaAsistencia || new Date().toISOString().split('T')[0];

        // Validar que el usuario exista
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

        // Insertar asistencia
        await Attendance.create({
            usuarioId,
            fecha: fechaFinal,
            tipoRegistro: 'MANUAL_ADMIN'
        });

        // Modificar los contadores de su plan de entrenamiento
        const suscripcionActiva = await Suscripcion.findOne({ where: { usuarioId } });
        if (suscripcionActiva) {
            await suscripcionActiva.decrement('diasTotalesDisponibles', { by: 1 });
            await suscripcionActiva.increment('diasAsistidos', { by: 1 });
        }

        return res.status(201).json({ status: 'success', message: 'Asistencia grabada manualmente por el administrador.' });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ status: 'error', message: 'Este usuario ya cuenta con asistencia registrada en esa fecha.' });
        }
        return res.status(500).json({ status: 'error', error: error.message });
    }
};