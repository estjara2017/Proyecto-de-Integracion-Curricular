const { Plan, Level, LevelResource, RoutineTemplate, AdminWorkoutTemplate, Usuario } = require('../models/index');

const crearDiasRutina = ({ carga, reps, rondas, metcon, tecnica, variacion = 1 }) => ([
    {
        dia: 'Lunes',
        bloques: [
            { tipo: 'Warm-up', ejercicios: variacion % 2 ? ['Jumping jacks', 'Good mornings', 'Squats'] : ['Brid dog', 'Lunges', 'Mountain climbers'], rondas: 2 },
            { tipo: 'Fuerza', ejercicios: [variacion % 2 ? `Back squat ${carga.sentadilla}` : `Front squat ${carga.sentadilla}`], rondas },
            { tipo: 'Skill', ejercicios: [tecnica.pull], rondas: 2 },
            { tipo: 'Metcon', ejercicios: [`${reps.media} power clean`, `${reps.media} burpees over bar`, `${reps.media} pull-ups`], formato: metcon }
        ]
    },
    {
        dia: 'Martes',
        bloques: [
            { tipo: 'Warm-up', ejercicios: variacion % 2 ? ['Shuttle run', 'Push-ups', 'Lunges'] : ['Dead bug', 'Caterpillar', 'Jump to plate'], rondas: 2 },
            { tipo: 'Weightlifting', ejercicios: [variacion % 2 ? `Snatch tecnico ${carga.snatch}` : `Clean pull ${carga.cleanJerk}`, 'Hang squat snatch', 'Overhead squat'], rondas },
            { tipo: 'Skill', ejercicios: [tecnica.handstand], rondas: 2 },
            { tipo: 'Metcon', ejercicios: [`${reps.alta} wall balls`, `${reps.media} box jumps`, `${reps.media} toes to bar`], formato: metcon }
        ]
    },
    {
        dia: 'Miercoles',
        bloques: [
            { tipo: 'Warm-up', ejercicios: variacion % 2 ? ['Dead bug', 'Mountain climbers', 'Ground to overhead'] : ['Walkout', 'Cerratos', 'Sit-ups'], rondas: 2 },
            { tipo: 'Fuerza', ejercicios: [`Strict press ${carga.press}`, 'Ring dips', 'DB row'], rondas },
            { tipo: 'Skill', ejercicios: [tecnica.core], rondas: 3 },
            { tipo: 'Metcon', ejercicios: [`${reps.media} deadlift`, `${reps.alta} run meters`, `${reps.media} kettlebell swings`], formato: metcon }
        ]
    },
    {
        dia: 'Jueves',
        bloques: [
            { tipo: 'Warm-up', ejercicios: variacion % 2 ? ['TABATA squats', 'Hollow rock', 'Walkout'] : ['Butter kicks', 'Single unders', 'Russian twist'], rondas: 2 },
            { tipo: 'Weightlifting', ejercicios: [`Clean and jerk ${carga.cleanJerk}`, 'Jerk technique', 'Front squat'], rondas },
            { tipo: 'Skill', ejercicios: [tecnica.gymnastic], rondas: 3 },
            { tipo: 'Metcon', ejercicios: [`${reps.media} thrusters`, `${reps.media} burpees`, `${reps.alta} row meters`], formato: metcon }
        ]
    },
    {
        dia: 'Viernes',
        bloques: [
            { tipo: 'Warm-up', ejercicios: variacion % 2 ? ['Sit-ups', 'Lunges', 'Push press'] : ['Fugitivos', 'Shoulder taps', 'Flex games'], rondas: 2 },
            { tipo: 'Fuerza', ejercicios: [`Bench press ${carga.bench}`, 'Romanian deadlift', 'Hammercurl'], rondas },
            { tipo: 'Skill', ejercicios: [tecnica.rope], rondas: 2 },
            { tipo: 'Metcon', ejercicios: [`${reps.media} DB snatch`, `${reps.media} wall climbers`, `${reps.alta} calories bike`], formato: metcon }
        ]
    }
]);

const construirRutinasNivel = (base) => [1, 2, 3, 4].map((semana) => ({
    ...base,
    semanaCiclo: semana,
    escalaPeso: {
        ...base.escalaPeso,
        semana: `Semana ${semana}`
    },
    diasSemana: crearDiasRutina({ ...base.config, variacion: semana })
}));

const rutinasPorNivel = {
    Principiante: {
        objetivo: 'Base tecnica, movilidad y constancia.',
        escalaPeso: { porcentajeBase: '40%-60%', referencia: 'carga ligera y tecnica limpia' },
        config: {
            carga: { sentadilla: '40%-50%', snatch: 'PVC/barra ligera', press: '40%-50%', cleanJerk: '40%-50%', bench: '40%-50%' },
            reps: { media: 8, alta: 200 },
            rondas: 3,
            metcon: 'For time controlado 12-15 min',
            tecnica: { pull: 'pull-up con progresiones', handstand: 'wall walk asistido', core: 'plank y hollow hold', gymnastic: 'crossover progresiones', rope: 'rope climb tecnica de pies' }
        }
    },
    Novato: {
        objetivo: 'Aumentar volumen, fuerza basica y transiciones.',
        escalaPeso: { porcentajeBase: '50%-65%', referencia: 'peso moderado sin romper tecnica' },
        config: {
            carga: { sentadilla: '55%-65%', snatch: '50%-60%', press: '50%-60%', cleanJerk: '55%-65%', bench: '55%-65%' },
            reps: { media: 10, alta: 300 },
            rondas: 4,
            metcon: 'AMRAP 15-18 min',
            tecnica: { pull: 'strict pull-up progresiones', handstand: 'handstand hold', core: 'L-sit progresion', gymnastic: 'pull-over progresiones', rope: 'rope climb parcial' }
        }
    },
    Intermedio: {
        objetivo: 'Consolidar potencia, volumen y gimnasia funcional.',
        escalaPeso: { porcentajeBase: '65%-80%', referencia: 'carga media-alta con pausas tecnicas' },
        config: {
            carga: { sentadilla: '70%-80%', snatch: '65%-75%', press: '65%-75%', cleanJerk: '70%-80%', bench: '70%-80%' },
            reps: { media: 12, alta: 400 },
            rondas: 5,
            metcon: 'For time 18-25 min',
            tecnica: { pull: 'chest to bar progresiones', handstand: 'HSPU progresiones', core: 'toes to bar', gymnastic: 'BMU progresiones', rope: 'rope climb completo' }
        }
    },
    Avanzado: {
        objetivo: 'Trabajo intenso con cargas altas y skills avanzadas.',
        escalaPeso: { porcentajeBase: '75%-90%', referencia: 'carga alta segun RM y control del coach' },
        config: {
            carga: { sentadilla: '80%-90%', snatch: '75%-85%', press: '75%-85%', cleanJerk: '80%-90%', bench: '80%-90%' },
            reps: { media: 15, alta: 600 },
            rondas: 5,
            metcon: 'AMRAP/For time 20-30 min',
            tecnica: { pull: 'bar muscle-up', handstand: 'HSPU estricto', core: 'toes to bar unbroken', gymnastic: 'RMU progresiones', rope: 'rope climb por tiempo' }
        }
    },
    Elite: {
        objetivo: 'Rendimiento competitivo, eficiencia y cargas maximas controladas.',
        escalaPeso: { porcentajeBase: '85%-105%', referencia: 'overload solo con supervision' },
        config: {
            carga: { sentadilla: '90%-105%', snatch: '85%-95%', press: '85%-95%', cleanJerk: '90%-100%', bench: '90%-100%' },
            reps: { media: 20, alta: 800 },
            rondas: 6,
            metcon: 'Competitivo 25-45 min',
            tecnica: { pull: 'BMU/RMU volumen', handstand: 'handstand walk', core: 'GHD/toes to bar volumen', gymnastic: 'butterfly y pull-over', rope: 'rope climb bajo fatiga' }
        }
    }
};

const videosPorNivel = (nivel) => [
    {
        titulo: `${nivel} - tecnica de sentadilla y levantamientos`,
        tipo: 'video',
        subtitulo: 'Clase demostrativa',
        url: `https://www.youtube.com/results?search_query=crossfit+${encodeURIComponent(nivel)}+squat+clean+snatch+technique`,
        descripcion: 'Busqueda guiada para tecnica de fuerza y weightlifting.'
    },
    {
        titulo: `${nivel} - progresiones gimnasticas`,
        tipo: 'video',
        subtitulo: 'Como se hace el movimiento',
        url: `https://www.youtube.com/results?search_query=crossfit+${encodeURIComponent(nivel)}+gymnastics+progressions`,
        descripcion: 'Busqueda guiada para pull-ups, HSPU, BMU/RMU y habilidades.'
    },
    {
        titulo: `${nivel} - metcon y acondicionamiento`,
        tipo: 'video',
        subtitulo: 'Ritmo y estrategia',
        url: `https://www.youtube.com/results?search_query=crossfit+${encodeURIComponent(nivel)}+metcon+conditioning`,
        descripcion: 'Busqueda guiada para metcons, pacing y resistencia.'
    }
];

const cargarPlanesIniciales = async () => {
    try {
        const planes = [
            { nombre: 'Plan Diario', precio: 4.50, meses: 0, duracionDias: 1, diasPorSemana: 1 },
            { nombre: 'Plan Semanal', precio: 40.00, meses: 0, duracionDias: 12, diasPorSemana: 5 },
            { nombre: 'Plan Mensual', precio: 50.00, meses: 1, duracionDias: 30, diasPorSemana: 5 },
            { nombre: 'Plan Trimestral', precio: 135.00, meses: 3, duracionDias: 90, diasPorSemana: 5 },
            { nombre: 'Plan Semestral', precio: 240.00, meses: 6, duracionDias: 180, diasPorSemana: 5 },
            { nombre: 'Plan Anual', precio: 450.00, meses: 12, duracionDias: 365, diasPorSemana: 5 }
        ];

        for (const plan of planes) {
            const [registro] = await Plan.findOrCreate({ where: { nombre: plan.nombre }, defaults: plan });
            await registro.update(plan);
        }

        const eliteExistente = await Level.findOne({ where: { nombre: 'Elite' } });
        if (eliteExistente && eliteExistente.orden === 4) {
            await eliteExistente.update({ orden: 99 });
        }

        const niveles = [
            { nombre: 'Principiante', orden: 1, mesesRequeridos: 0, pesoMaximoBaseLb: 95, rendimientoMinimo: 20, rendimientoEsperado: 60, puntosParaAscenso: 600 },
            { nombre: 'Novato', orden: 2, mesesRequeridos: 6, pesoMaximoBaseLb: 115, rendimientoMinimo: 40, rendimientoEsperado: 60, puntosParaAscenso: 1200 },
            { nombre: 'Intermedio', orden: 3, mesesRequeridos: 12, pesoMaximoBaseLb: 205, rendimientoMinimo: 40, rendimientoEsperado: 70, puntosParaAscenso: 2400 },
            { nombre: 'Avanzado', orden: 4, mesesRequeridos: 24, pesoMaximoBaseLb: 245, rendimientoMinimo: 55, rendimientoEsperado: 80, puntosParaAscenso: 4200 },
            { nombre: 'Elite', orden: 5, mesesRequeridos: 48, pesoMaximoBaseLb: 285, rendimientoMinimo: 70, rendimientoEsperado: 90, puntosParaAscenso: 999999 }
        ];

        for (const nivel of niveles) {
            const [level] = await Level.findOrCreate({ where: { nombre: nivel.nombre }, defaults: nivel });
            await level.update(nivel);

            const rutinas = construirRutinasNivel(rutinasPorNivel[nivel.nombre]);
            for (const rutina of rutinas) {
                const [template] = await RoutineTemplate.findOrCreate({
                    where: { levelId: level.id, nombre: `Plantilla ${nivel.nombre} semana ${rutina.semanaCiclo}` },
                    defaults: {
                        descripcion: `Rutina base semanal ${rutina.semanaCiclo} para atletas en nivel ${nivel.nombre}.`,
                        objetivo: rutina.objetivo,
                        semanaCiclo: rutina.semanaCiclo,
                        escalaPeso: rutina.escalaPeso,
                        diasSemana: rutina.diasSemana,
                        activo: true
                    }
                });
                await template.update({
                    descripcion: `Rutina base semanal ${rutina.semanaCiclo} para atletas en nivel ${nivel.nombre}.`,
                    objetivo: rutina.objetivo,
                    semanaCiclo: rutina.semanaCiclo,
                    escalaPeso: rutina.escalaPeso,
                    diasSemana: rutina.diasSemana,
                    activo: true
                });
            }

            for (const recurso of videosPorNivel(nivel.nombre)) {
                const [resource] = await LevelResource.findOrCreate({
                    where: { levelId: level.id, titulo: recurso.titulo },
                    defaults: recurso
                });
                await resource.update(recurso);
            }
        }

        await Usuario.findOrCreate({
            where: { correo: 'admin@elemental.local' },
            defaults: {
                nombre: 'Administrador',
                apellido: 'Elemental',
                cedula: 'ADMIN-001',
                correo: 'admin@elemental.local',
                telefono: '0000000000',
                direccion: 'Elemental Cross Training',
                fechaNacimiento: '1995-01-01',
                genero: 'Masculino',
                rol: 'admin',
                estado: 'activo'
            }
        });

        const rutinasAdmin = [
            {
                titulo: 'Rutina general tecnica',
                descripcion: 'Plantilla base para trabajo presencial con enfoque tecnico.',
                bloques: [
                    { tipo: 'Warm-up', ejercicios: ['2 rondas: 20 jumping jacks', '15 good mornings', '10 squats'] },
                    { tipo: 'Fuerza', ejercicios: ['Back squat 4 rondas', 'Press militar 4 rondas'] },
                    { tipo: 'Metcon', ejercicios: ['AMRAP 15 min', '10 wall balls', '8 burpees', '200 m run'] }
                ]
            },
            {
                titulo: 'Rutina general fuerza',
                descripcion: 'Plantilla reutilizable para dias de fuerza y levantamiento.',
                bloques: [
                    { tipo: 'Warm-up', ejercicios: ['Movilidad de cadera', 'Dead bug', 'Walkout'] },
                    { tipo: 'Weightlifting', ejercicios: ['Clean and jerk tecnico', 'Snatch pull', 'Front squat'] },
                    { tipo: 'Metcon', ejercicios: ['For time 18 min', '12 kettlebell swings', '10 toes to bar', '8 box jumps'] }
                ]
            }
        ];

        for (const rutina of rutinasAdmin) {
            const [template] = await AdminWorkoutTemplate.findOrCreate({
                where: { titulo: rutina.titulo },
                defaults: rutina
            });
            await template.update(rutina);
        }

        console.log('Datos iniciales de Elemental cargados.');
    } catch (error) {
        console.error('Error al insertar datos iniciales:', error);
    }
};

module.exports = cargarPlanesIniciales;
