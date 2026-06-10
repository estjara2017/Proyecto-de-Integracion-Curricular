const { Usuario, OtpModel, Level, LevelResource, RoutineTemplate } = require('../models/index');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { calcularEdad, obtenerRangoEdad, calcularPorcentajeProgreso, calcularSemanaCiclo } = require('../utils/athleteMetrics');

const JWT_SECRET = process.env.JWT_SECRET || 'ElementalCrossTraining_Secret_Key_2026';

exports.registrarUsuario = async (req, res) => {
    try {
        const {
            nombre, apellido, cedula, correo, telefono,
            peso, estatura, direccion, fechaNacimiento,
            genero, poseeLesion, detalleLesion
        } = req.body;

        const existeCorreo = await Usuario.findOne({ where: { correo } });
        if (existeCorreo) {
            return res.status(400).json({ status: 'error', message: 'El correo electronico ya esta registrado.' });
        }

        const existeCedula = await Usuario.findOne({ where: { cedula } });
        if (existeCedula) {
            return res.status(400).json({ status: 'error', message: 'La cedula o identificacion ya esta registrada.' });
        }

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            cedula,
            correo,
            telefono,
            peso: peso || null,
            estatura: estatura || null,
            direccion,
            fechaNacimiento,
            genero,
            poseeLesion: poseeLesion || 'NO',
            detalleLesion: poseeLesion === 'SI' ? detalleLesion : null
        });

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado con exito. Ya puedes solicitar tu codigo de acceso con este correo.',
            data: nuevoUsuario
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error interno en el servidor.', error: error.message });
    }
};

exports.solicitarOtp = async (req, res) => {
    try {
        const { correo } = req.body;
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'El correo no corresponde a ningun usuario registrado.' });
        }

        const codigoOtp = Math.floor(1000 + Math.random() * 9000).toString();
        await OtpModel.destroy({ where: { correo } });
        await OtpModel.create({ correo, codigo: codigoOtp });

        console.log(`[OTP Elemental] ${correo}: ${codigoOtp}`);

        return res.status(200).json({
            status: 'success',
            message: 'Codigo OTP enviado con exito a tu correo electronico.'
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error al generar el codigo de acceso.', error: error.message });
    }
};

exports.verificarOtp = async (req, res) => {
    try {
        const { correo, codigo, codigoOtp } = req.body;
        const codigoIngresado = codigo || codigoOtp;

        const otpRecord = await OtpModel.findOne({
            where: {
                correo,
                usado: false,
                expiraEn: { [Op.gt]: new Date() }
            }
        });

        if (!otpRecord) {
            return res.status(400).json({ status: 'error', message: 'El codigo es incorrecto o ya ha expirado.' });
        }

        if (otpRecord.intentos >= 3) {
            await otpRecord.destroy();
            return res.status(429).json({ status: 'error', message: 'Demasiados intentos fallidos. Solicita un nuevo codigo.' });
        }

        if (otpRecord.codigo !== codigoIngresado) {
            await otpRecord.increment('intentos', { by: 1 });
            return res.status(400).json({ status: 'error', message: 'El codigo es incorrecto o ya ha expirado.' });
        }

        const usuario = await Usuario.findOne({ where: { correo } });
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '24h' });
        await OtpModel.destroy({ where: { correo } });

        return res.status(200).json({
            status: 'success',
            message: 'Ingreso autorizado.',
            token,
            usuario
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error al verificar el acceso.', error: error.message });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id);
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
        }

        const nivel = await Level.findOne({
            where: { nombre: usuario.nivel },
            include: [LevelResource, {
                model: RoutineTemplate,
                where: { activo: true, semanaCiclo: calcularSemanaCiclo() },
                required: false
            }]
        });

        const metricas = calcularPorcentajeProgreso(usuario, nivel);
        return res.status(200).json({ status: 'success', usuario, nivel, metricas });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.obtenerRutinasDelNivel = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id);
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
        }

        const nivel = await Level.findOne({
            where: { nombre: usuario.nivel },
            include: [
                { model: RoutineTemplate, where: { activo: true, semanaCiclo: calcularSemanaCiclo() }, required: false },
                { model: LevelResource, required: false }
            ]
        });

        return res.status(200).json({
            status: 'success',
            nivel: nivel ? nivel.nombre : usuario.nivel,
            semanaCiclo: calcularSemanaCiclo(),
            rutinas: nivel ? nivel.RoutineTemplates : [],
            recursos: nivel ? nivel.LevelResources : []
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.actualizarHorario = async (req, res) => {
    try {
        const horariosValidos = ['05:00', '06:00', '07:00', '16:00', '17:00', '18:00', '19:00', 'Sabado 07:00', 'Sabado 08:00'];
        const { horarioEntrenamiento } = req.body;

        if (!horariosValidos.includes(horarioEntrenamiento)) {
            return res.status(400).json({ status: 'error', message: 'Horario no valido.' });
        }

        const usuario = await Usuario.findByPk(req.user.id);
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
        }

        if (usuario.estado !== 'activo') {
            return res.status(403).json({ status: 'error', message: 'Debes tener un plan activo para escoger horario.' });
        }

        usuario.horarioEntrenamiento = horarioEntrenamiento;
        await usuario.save();

        return res.status(200).json({ status: 'success', usuario });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.actualizarAvatar = async (req, res) => {
    try {
        const avataresValidos = ['agua', 'fuego', 'aire', 'tierra'];
        const { avatar } = req.body;

        if (!avataresValidos.includes(avatar)) {
            return res.status(400).json({ status: 'error', message: 'Avatar no valido.' });
        }

        const usuario = await Usuario.findByPk(req.user.id);
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado.' });
        }

        usuario.avatar = avatar;
        await usuario.save();

        return res.status(200).json({ status: 'success', usuario });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.obtenerRanking = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: { rol: 'cliente' },
            order: [['puntos', 'DESC'], ['porcentajeProgreso', 'DESC']]
        });

        const data = usuarios.map((usuario, index) => ({
            posicionGlobal: index + 1,
            id: usuario.id,
            nombre: `${usuario.nombre} ${usuario.apellido}`,
            nivel: usuario.nivel,
            edad: calcularEdad(usuario.fechaNacimiento),
            genero: usuario.genero,
            rangoEdad: obtenerRangoEdad(calcularEdad(usuario.fechaNacimiento)),
            puntos: usuario.puntos,
            scoreFinal: usuario.puntos,
            porcentajeProgreso: usuario.porcentajeProgreso
        }));

        return res.status(200).json({ status: 'success', data });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};
