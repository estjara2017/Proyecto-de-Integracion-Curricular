// src/controllers/authController.js
const Usuario = require('../models/usuario');
const OtpRecord = require('../models/otpRecord');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// 1. REGISTRAR USUARIO (Desde tu formulario actual)
exports.registrarUsuario = async (req, res) => {
    try {
        const { 
            nombre, apellido, cedula, correo, telefono, 
            peso, estatura, direccion, fechaNacimiento, 
            genero, poseeLesion, detalleLesion 
        } = req.body;

        const existeCorreo = await Usuario.findOne({ where: { correo } });
        if (existeCorreo) {
            return res.status(400).json({ status: 'error', message: 'El correo electrónico ya está registrado.' });
        }

        const existeCedula = await Usuario.findOne({ where: { cedula } });
        if (existeCedula) {
            return res.status(400).json({ status: 'error', message: 'La cédula o identificación ya está registrada.' });
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
            // avatar, nivel ('Principiante'), puntos, rol y estado se crean por defecto
        });

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado con éxito. Ya puedes solicitar tu código de acceso con este correo.',
            data: nuevoUsuario
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error interno en el servidor.' });
    }
};

// 2. SOLICITAR OTP (Cuando ingresan su correo en /attendance)
exports.solicitarOtp = async (req, res) => {
    try {
        const { correo } = req.body;

        // Verificar que el usuario exista en la plataforma
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'El correo no corresponde a ningún usuario registrado.' });
        }

        // Generar número aleatorio de 4 dígitos
        const codigoOtp = Math.floor(1000 + Math.random() * 9000).toString();

        // Eliminar OTPs viejos de este correo para no acumular basura
        await OtpRecord.destroy({ where: { correo } });

        // Guardar el nuevo OTP
        await OtpRecord.create({
            correo,
            codigo: codigoOtp
        });

        // SIMULACIÓN DE ENVÍO DE EMAIL
        console.log(`\n==========================================`);
        console.log(`[EMAIL] Para: ${correo}`);
        console.log(`[EMAIL] Mensaje: Tu código de acceso a Elemental es: ${codigoOtp}`);
        console.log(`==========================================\n`);

        // Aquí conectarías tu Nodemailer / servicio de correo real a futuro

        return res.status(200).json({
            status: 'success',
            message: 'Código OTP enviado con éxito a tu correo electrónico.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al generar el código de acceso.' });
    }
};

// 3. VERIFICAR OTP (Iniciar sesión y entregar Token)
exports.verificarOtp = async (req, res) => {
    try {
        const { correo, codigo } = req.body;

        // Buscar el registro que coincida y que NO esté expirado
        const otpValido = await OtpRecord.findOne({
            where: {
                correo,
                codigo,
                expiraEn: { [Op.gt]: new Date() } // expiraEn > Hora Actual
            }
        });

        if (!otpValido) {
            return res.status(400).json({ status: 'error', message: 'El código es incorrecto o ya ha expirado.' });
        }

        // Buscar los datos completos del usuario
        const usuario = await Usuario.findOne({ where: { correo } });

        // Generar JWT Token para mantener la sesión activa en React
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET || 'firma_secreta_elemental', 
            { expiresIn: '24h' }
        );

        // Destruir el OTP ya utilizado
        await OtpRecord.destroy({ where: { correo } });

        return res.status(200).json({
            status: 'success',
            message: 'Ingreso autorizado.',
            token,
            usuario
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al verificar el acceso.' });
    }
};