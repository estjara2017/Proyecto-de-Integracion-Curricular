const { AdminWorkoutTemplate } = require('../models/index');

const WEEK_DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

const normalizeIdList = (value = []) => (
    Array.isArray(value) ? value.map((item) => Number(item)).filter(Boolean) : []
);

const normalizeLevelList = (value = []) => (
    Array.isArray(value) ? value.filter(Boolean) : []
);

const buildDaysFromBlocks = (bloques = []) => (
    WEEK_DAYS.map((dia) => ({
        dia,
        bloques: bloques.map((bloque) => ({
            tipo: bloque.tipo,
            ejercicios: bloque.ejercicios || []
        }))
    }))
);

const normalizeDayName = (value = '') => (
    String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
);

const ensureMondayToSunday = (days = [], fallbackBlocks = []) => {
    if (!days.length) return buildDaysFromBlocks(fallbackBlocks);

    const daysByName = new Map(days.map((day) => [normalizeDayName(day.dia), day]));
    const fallbackDays = days.length ? days : buildDaysFromBlocks(fallbackBlocks);

    return WEEK_DAYS.map((dia, index) => {
        const sourceDay = daysByName.get(normalizeDayName(dia)) || fallbackDays[index % fallbackDays.length];
        return {
            ...sourceDay,
            dia,
            bloques: sourceDay?.bloques || []
        };
    });
};

const routineToClientShape = (routine, source = 'admin') => ({
    id: `${source}-${routine.id}`,
    nombre: routine.titulo,
    descripcion: routine.descripcion,
    objetivo: routine.objetivo || routine.descripcion,
    semanaCiclo: 1,
    etiqueta: routine.etiqueta,
    tipoAsignacion: routine.tipoAsignacion,
    lesionObjetivo: routine.lesionObjetivo,
    escalaPeso: {},
    diasSemana: ensureMondayToSunday(routine.diasSemana || [], routine.bloques || []),
    activo: routine.activo
});

const getAssignedRoutinesForUser = async (usuario) => {
    const routines = await AdminWorkoutTemplate.findAll({
        where: { activo: true },
        order: [['updatedAt', 'DESC']]
    });

    const usuarioId = Number(usuario.id);
    const nivelUsuario = usuario.nivel;
    const personalizadas = [];
    const porNivel = [];

    for (const routine of routines) {
        const usuarioIds = normalizeIdList(routine.usuarioIds);
        const niveles = normalizeLevelList(routine.niveles);

        if (usuarioIds.includes(usuarioId)) {
            personalizadas.push(routineToClientShape(routine, 'personalizada'));
            continue;
        }

        if (niveles.includes(nivelUsuario)) {
            porNivel.push(routineToClientShape(routine, 'nivel'));
        }
    }

    return [...personalizadas, ...porNivel];
};

module.exports = {
    WEEK_DAYS,
    getAssignedRoutinesForUser,
    ensureMondayToSunday,
    routineToClientShape
};
