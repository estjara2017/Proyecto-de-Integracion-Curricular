const { Usuario, Plan, Suscripcion, Pago, Level, LevelResource, RoutineTemplate, AdminWorkoutTemplate, Attendance } = require('../models/index');
const { calcularEdad, obtenerRangoEdad, calcularPorcentajeProgreso } = require('../utils/athleteMetrics');
const { isValidPhone, normalizeEmail, normalizeUserTextFields, toUpperText } = require('../utils/textNormalization');
const { WEEK_DAYS } = require('../utils/routineAssignments');

const normalizarListaIds = (value = []) => (
    Array.isArray(value) ? value.map((item) => Number(item)).filter(Boolean) : []
);

const normalizarListaTexto = (value = []) => (
    Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : []
);

const extraerYoutubeVideoId = (url = '') => {
    try {
        const parsed = new URL(String(url).trim());
        const host = parsed.hostname.replace(/^www\./, '');
        let id = '';

        if (host === 'youtu.be') {
            id = parsed.pathname.split('/').filter(Boolean)[0] || '';
        }

        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (parsed.pathname.startsWith('/watch')) id = parsed.searchParams.get('v') || '';
            if (parsed.pathname.startsWith('/embed/')) id = parsed.pathname.split('/').filter(Boolean)[1] || '';
            if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.split('/').filter(Boolean)[1] || '';
            if (parsed.pathname.startsWith('/live/')) id = parsed.pathname.split('/').filter(Boolean)[1] || '';
        }

        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
    } catch {
        return '';
    }
};

const esUrlHttpValida = (url = '') => {
    if (!url) return true;
    try {
        const parsed = new URL(String(url).trim());
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};

const normalizarDiasSemana = (diasSemana = [], bloques = [], soloDia = false) => {
    if (Array.isArray(diasSemana) && diasSemana.length) {
        if (soloDia) {
            const dia = diasSemana[0];
            return [{
                dia: dia.dia || WEEK_DAYS[0],
                bloques: Array.isArray(dia.bloques) ? dia.bloques.slice(0, 5).map((bloque) => ({
                    tipo: bloque.tipo || 'Bloque',
                    ejercicios: Array.isArray(bloque.ejercicios) ? bloque.ejercicios : []
                })) : []
            }];
        }

        return WEEK_DAYS.map((nombreDia, index) => {
            const dia = diasSemana.find((item) => item.dia === nombreDia) || diasSemana[index] || {};
            return {
                dia: nombreDia,
                bloques: Array.isArray(dia.bloques) ? dia.bloques.slice(0, 5).map((bloque) => ({
                    tipo: bloque.tipo || 'Bloque',
                    ejercicios: Array.isArray(bloque.ejercicios) ? bloque.ejercicios : []
                })) : []
            };
        });
    }

    return WEEK_DAYS.map((dia) => ({
        dia,
        bloques: bloques.slice(0, 5).map((bloque) => ({
            tipo: bloque.tipo || 'Bloque',
            ejercicios: Array.isArray(bloque.ejercicios) ? bloque.ejercicios : []
        }))
    }));
};

const formatearAtletaRanking = async (usuario, index) => {
    const nivel = await Level.findOne({ where: { nombre: usuario.nivel } });
    const siguienteNivel = nivel ? await Level.findOne({ where: { orden: nivel.orden + 1 } }) : null;
    const nivelAnterior = nivel ? await Level.findOne({ where: { orden: nivel.orden - 1 } }) : null;
    const listoParaAscenso = Boolean(siguienteNivel && usuario.puntos >= nivel.puntosParaAscenso);
    const listoParaDescenso = Boolean(nivelAnterior && usuario.puntos < nivelAnterior.puntosParaAscenso);

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
        listoParaDescenso,
        siguienteNivel: siguienteNivel ? siguienteNivel.nombre : null,
        nivelAnterior: nivelAnterior ? nivelAnterior.nombre : null,
        puntosMinimosNivelActual: nivelAnterior ? nivelAnterior.puntosParaAscenso : 0
    };
};

exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Usuario.findAll({
            where: { rol: 'cliente' },
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        for (const cliente of clientes) {
            const nivel = await Level.findOne({ where: { nombre: cliente.nivel } });
            const metricas = calcularPorcentajeProgreso(cliente, nivel);
            if (cliente.porcentajeProgreso !== metricas.porcentajeProgreso) {
                cliente.porcentajeProgreso = metricas.porcentajeProgreso;
                await cliente.save();
            }
        }

        return res.status(200).json({ status: 'success', data: clientes });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.listarClientesParaAsistencia = async (req, res) => {
    try {
        const { horario, genero, rangoEdad, nivel } = req.query;
        const where = { rol: 'cliente', estado: 'activo' };

        if (horario) where.horarioEntrenamiento = horario;
        if (genero) where.genero = toUpperText(genero);
        if (nivel) where.nivel = nivel;

        const clientes = await Usuario.findAll({
            where,
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        const fechaHoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' });
        const asistenciasHoy = await Attendance.findAll({
            where: { fecha: fechaHoy, usuarioId: clientes.map((cliente) => cliente.id) },
            attributes: ['usuarioId']
        });
        const clientesRegistrados = new Set(
            asistenciasHoy.map((asistencia) => Number(asistencia.usuarioId))
        );

        const data = clientes
            .map((cliente) => ({
                id: cliente.id,
                nombre: `${cliente.nombre} ${cliente.apellido}`,
                genero: cliente.genero,
                horarioEntrenamiento: cliente.horarioEntrenamiento,
                edad: calcularEdad(cliente.fechaNacimiento),
                rangoEdad: obtenerRangoEdad(calcularEdad(cliente.fechaNacimiento)),
                nivel: cliente.nivel,
                asistenciaRegistrada: clientesRegistrados.has(Number(cliente.id))
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
        Object.assign(cambios, normalizeUserTextFields(cambios));

        if (!isValidPhone(cambios.telefono)) {
            return res.status(400).json({ status: 'error', message: 'El telefono solo debe contener numeros.' });
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

exports.asignarRolAdminPorCorreo = async (req, res) => {
    try {
        const { correo } = req.body;
        if (!correo) {
            return res.status(400).json({ status: 'error', message: 'El correo electronico es obligatorio.' });
        }

        const usuario = await Usuario.findOne({ where: { correo: normalizeEmail(correo) } });
        if (!usuario) {
            return res.status(404).json({ status: 'error', message: 'No existe un usuario con ese correo electronico.' });
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
        const {
            id,
            titulo,
            etiqueta,
            descripcion,
            objetivo,
            tipoAsignacion,
            niveles = [],
            usuarioIds = [],
            lesionObjetivo,
            bloques = [],
            diasSemana = []
        } = req.body;

        if (!titulo) {
            return res.status(400).json({ status: 'error', message: 'Titulo es obligatorio.' });
        }

        const payload = {
            titulo,
            etiqueta,
            descripcion,
            objetivo,
            tipoAsignacion: tipoAsignacion || 'general',
            niveles: normalizarListaTexto(niveles),
            usuarioIds: normalizarListaIds(usuarioIds),
            lesionObjetivo,
            bloques,
            diasSemana: normalizarDiasSemana(
                diasSemana,
                bloques,
                ['diaria_admin', 'rutina_general', 'rutina_avanzada'].includes(tipoAsignacion)
            ),
            activo: true
        };

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

exports.eliminarRutinaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const rutina = await AdminWorkoutTemplate.findByPk(id);
        if (!rutina) return res.status(404).json({ status: 'error', message: 'Rutina no encontrada.' });

        await rutina.update({ activo: false });
        return res.status(200).json({ status: 'success', message: 'Rutina eliminada.', data: rutina });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.listarRecursosPorNivel = async (req, res) => {
    try {
        const niveles = await Level.findAll({
            include: [{ model: LevelResource, where: { activo: true }, required: false }],
            order: [['orden', 'ASC'], [LevelResource, 'orden', 'ASC'], [LevelResource, 'id', 'ASC']]
        });
        return res.status(200).json({ status: 'success', data: niveles });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.guardarRecursoNivel = async (req, res) => {
    try {
        const {
            id,
            levelId,
            titulo,
            tipo = 'video',
            url,
            subtitulo,
            descripcion,
            canalUrl,
            orden = 1
        } = req.body;

        const urlLimpia = String(url || '').trim();
        const canalUrlLimpia = String(canalUrl || '').trim();

        if (!levelId || !titulo || !urlLimpia) {
            return res.status(400).json({ status: 'error', message: 'Nivel, titulo y URL son obligatorios.' });
        }

        if (!extraerYoutubeVideoId(urlLimpia)) {
            return res.status(400).json({
                status: 'error',
                message: 'Ingresa un enlace valido de YouTube con ID de video completo. Ejemplo: https://www.youtube.com/watch?v=XXXXXXXXXXX'
            });
        }

        if (canalUrlLimpia && !esUrlHttpValida(canalUrlLimpia)) {
            return res.status(400).json({
                status: 'error',
                message: 'La URL del canal o pagina debe iniciar con http:// o https://.'
            });
        }

        const level = await Level.findByPk(levelId);
        if (!level) return res.status(404).json({ status: 'error', message: 'Nivel no encontrado.' });

        const payload = {
            levelId,
            titulo,
            tipo,
            url: urlLimpia,
            subtitulo,
            descripcion,
            canalUrl: canalUrlLimpia || null,
            orden,
            activo: true
        };

        const recurso = id ? await LevelResource.findByPk(id) : await LevelResource.create(payload);
        if (!recurso) return res.status(404).json({ status: 'error', message: 'Recurso no encontrado.' });
        if (id) await recurso.update(payload);

        return res.status(id ? 200 : 201).json({ status: 'success', data: recurso });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

exports.eliminarRecursoNivel = async (req, res) => {
    try {
        const { id } = req.params;
        const recurso = await LevelResource.findByPk(id);
        if (!recurso) return res.status(404).json({ status: 'error', message: 'Recurso no encontrado.' });

        await recurso.update({ activo: false });
        return res.status(200).json({ status: 'success', message: 'Recurso eliminado.', data: recurso });
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

exports.descenderCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nivelDestino } = req.body;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ status: 'error', message: 'Cliente no encontrado.' });

        const nivelActual = await Level.findOne({ where: { nombre: usuario.nivel } });
        if (!nivelActual) return res.status(400).json({ status: 'error', message: 'Nivel actual no configurado.' });

        const whereNivelDestino = nivelDestino
            ? { nombre: nivelDestino }
            : { orden: nivelActual.orden - 1 };

        const nivelAnterior = await Level.findOne({
            where: whereNivelDestino,
            include: [LevelResource, {
                model: RoutineTemplate,
                where: { activo: true },
                required: false
            }]
        });

        if (!nivelAnterior) {
            return res.status(400).json({ status: 'error', message: 'No existe un nivel inferior disponible.' });
        }

        if (nivelAnterior.orden >= nivelActual.orden) {
            return res.status(400).json({ status: 'error', message: 'El nivel destino debe ser inferior al nivel actual.' });
        }

        if (usuario.puntos >= nivelAnterior.puntosParaAscenso) {
            return res.status(400).json({
                status: 'error',
                message: `El cliente aun conserva los puntos minimos para permanecer en ${nivelActual.nombre}.`
            });
        }

        usuario.nivel = nivelAnterior.nombre;
        usuario.porcentajeProgreso = 0;
        await usuario.save();

        return res.status(200).json({
            status: 'success',
            message: `Cliente descendido a ${nivelAnterior.nombre}.`,
            usuario,
            recursos: nivelAnterior.LevelResources,
            rutinas: nivelAnterior.RoutineTemplates
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};
