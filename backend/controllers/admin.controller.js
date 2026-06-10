const { Usuario, Plan, Suscripcion, Pago, Level, LevelResource, RoutineTemplate, AdminWorkoutTemplate } = require('../models/index');
const { calcularEdad, obtenerRangoEdad, calcularPorcentajeProgreso } = require('../utils/athleteMetrics');

const formatearAtletaRanking = async (usuario, index) => {
    const nivel = await Level.findOne({ where: { nombre: usuario.nivel } });
    const siguienteNivel = nivel ? await Level.findOne({ where: { orden: nivel.orden + 1 } }) : null;
    const listoParaAscenso = Boolean(siguienteNivel && usuario.puntos >= nivel.puntosParaAscenso);

    return {
        posicionGlobal: index + 1,
        id: usuario.id,
        atleta: `${usuario.nombre} ${usuario.apellido}`,
        edad: calcularEdad(usuario.fechaNacimiento),
        rangoEdad: obtenerRangoEdad(calcularEdad(usuario.fechaNacimiento)),
        genero: usuario.genero,
        nivel: usuario.nivel,
        puntos: usuario.puntos,
        porcentajeProgreso: usuario.porcentajeProgreso,
        listoParaAscenso,
        siguienteNivel: siguienteNivel ? siguienteNivel.nombre : null
    };
};

exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Usuario.findAll({
            where: { rol: 'cliente' },
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        return res.status(200).json({ status: 'success', data: clientes });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.listarClientesParaAsistencia = async (req, res) => {
    try {
        const { horario, genero, rangoEdad } = req.query;
        const where = { rol: 'cliente', estado: 'activo' };

        if (horario) where.horarioEntrenamiento = horario;
        if (genero) where.genero = genero;

        const clientes = await Usuario.findAll({
            where,
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        const data = clientes
            .map((cliente) => ({
                id: cliente.id,
                nombre: `${cliente.nombre} ${cliente.apellido}`,
                genero: cliente.genero,
                horarioEntrenamiento: cliente.horarioEntrenamiento,
                edad: calcularEdad(cliente.fechaNacimiento),
                rangoEdad: obtenerRangoEdad(calcularEdad(cliente.fechaNacimiento)),
                nivel: cliente.nivel
            }))
            .filter((cliente) => !rangoEdad || cliente.rangoEdad === rangoEdad);

        return res.status(200).json({ status: 'success', data });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const camposPermitidos = ['correo', 'telefono', 'direccion', 'estado', 'peso', 'estatura', 'pesoLevantamientoKg', 'pesoMaxPromedioKg', 'porcentajeProgreso', 'horarioEntrenamiento'];
        const cambios = {};

        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) cambios[campo] = req.body[campo];
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado.' });

        const progresoAnterior = Number(usuario.porcentajeProgreso || 0);
        await usuario.update(cambios);

        const nivel = await Level.findOne({ where: { nombre: usuario.nivel } });
        const metricas = calcularPorcentajeProgreso(usuario, nivel);
        usuario.porcentajeProgreso = metricas.porcentajeProgreso;

        if (metricas.porcentajeProgreso > progresoAnterior) {
            const puntosProgreso = Math.min((metricas.porcentajeProgreso - progresoAnterior) * 5, 100);
            usuario.puntos = Number(usuario.puntos || 0) + puntosProgreso;
        }

        await usuario.save();
        return res.status(200).json({ status: 'success', data: usuario });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado.' });

        await usuario.update({ estado: 'inactivo' });
        return res.status(200).json({ status: 'success', message: 'Cliente desactivado.', data: usuario });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.asignarRolAdminPorCedula = async (req, res) => {
    try {
        const { cedula } = req.body;
        if (!cedula) {
            return res.status(400).json({ status: 'error', message: 'La cedula es obligatoria.' });
        }

        const usuario = await Usuario.findOne({ where: { cedula } });
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'No existe un usuario con esa cedula.' });
        }

        usuario.rol = 'admin';
        usuario.estado = 'activo';
        await usuario.save();

        return res.status(200).json({
            status: 'success',
            message: `El usuario ${usuario.nombre} ${usuario.apellido} ahora es administrador.`,
            data: usuario
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.listarPagosPendientes = async (req, res) => {
    try {
        const pagos = await Pago.findAll({
            where: { estado: 'pendiente' },
            include: [{
                model: Suscripcion,
                include: [Usuario, Plan]
            }],
            order: [['fechaNotificacion', 'ASC']]
        });

        return res.status(200).json({ status: 'success', data: pagos });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.listarRutinasAdmin = async (req, res) => {
    try {
        const rutinas = await AdminWorkoutTemplate.findAll({
            where: { activo: true },
            order: [['updatedAt', 'DESC']]
        });
        return res.status(200).json({ status: 'success', data: rutinas });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.guardarRutinaAdmin = async (req, res) => {
    try {
        const { id, titulo, descripcion, bloques } = req.body;

        if (!titulo || !Array.isArray(bloques)) {
            return res.status(400).json({ status: 'error', message: 'Titulo y bloques son obligatorios.' });
        }

        const payload = { titulo, descripcion, bloques, activo: true };
        const rutina = id
            ? await AdminWorkoutTemplate.findByPk(id)
            : await AdminWorkoutTemplate.create(payload);

        if (!rutina) return res.status(404).json({ status: 'error', message: 'Rutina no encontrada.' });
        if (id) await rutina.update(payload);

        return res.status(id ? 200 : 201).json({ status: 'success', data: rutina });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.listarRecursosPorNivel = async (req, res) => {
    try {
        const niveles = await Level.findAll({
            include: [LevelResource],
            order: [['orden', 'ASC']]
        });
        return res.status(200).json({ status: 'success', data: niveles });
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

        const ranking = [];
        for (let index = 0; index < usuarios.length; index += 1) {
            ranking.push(await formatearAtletaRanking(usuarios[index], index));
        }

        return res.status(200).json({ status: 'success', data: ranking });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.promoverCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nivelDestino } = req.body;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado.' });

        const nivelActual = await Level.findOne({ where: { nombre: usuario.nivel } });
        if (!nivelActual) return res.status(400).json({ status: 'error', message: 'Nivel actual no configurado.' });

        const whereNivelDestino = nivelDestino
            ? { nombre: nivelDestino }
            : { orden: nivelActual.orden + 1 };

        const siguienteNivel = await Level.findOne({
            where: whereNivelDestino,
            include: [LevelResource, {
                model: RoutineTemplate,
                where: { activo: true },
                required: false
            }]
        });

        if (!siguienteNivel) {
            return res.status(400).json({ status: 'error', message: 'Nivel destino no disponible.' });
        }

        if (siguienteNivel.orden <= nivelActual.orden) {
            return res.status(400).json({ status: 'error', message: 'El nivel destino debe ser superior al nivel actual.' });
        }

        if (usuario.puntos < nivelActual.puntosParaAscenso) {
            return res.status(400).json({ status: 'error', message: 'El cliente aun no alcanza los puntos necesarios para ascender.' });
        }

        usuario.nivel = siguienteNivel.nombre;
        usuario.porcentajeProgreso = 0;
        await usuario.save();

        return res.status(200).json({
            status: 'success',
            message: `Cliente promovido a ${siguienteNivel.nombre}.`,
            usuario,
            recursos: siguienteNivel.LevelResources,
            rutinas: siguienteNivel.RoutineTemplates
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};
