const DailyCode = require('../models/DailyCode');

const DICCIONARIO_CROSSFIT = [
    'WOD', 'BURPEE', 'AMRAP', 'THRUSTER', 'SNATCH', 'CLEAN', 'JERK',
    'KETTLEBELL', 'BOXJUMP', 'DEADLIFT', 'EMOM', 'TABATA', 'WALLBALL',
    'PULLUP', 'PUSHUP', 'SQUAT', 'CHINUP', 'METCON', 'ROPECLIMB',
    'HSPU', 'MUSCLEUP', 'ROW', 'BIKE', 'LUNGE', 'TOESTOBAR',
    'WALLWALK', 'FRONTSQUAT', 'BACKSQUAT', 'OVERHEAD', 'DOUBLEUNDER'
];

const generarPalabraDelDia = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const existe = await DailyCode.findOne({ where: { fecha: hoy } });

    if (existe) return existe;

    const indiceAleatorio = Math.floor(Math.random() * DICCIONARIO_CROSSFIT.length);
    const palabraSeleccionada = DICCIONARIO_CROSSFIT[indiceAleatorio];

    const registro = await DailyCode.create({
        palabra: palabraSeleccionada,
        fecha: hoy
    });

    console.log(`[QR] Palabra clave del dia generada: ${palabraSeleccionada}`);
    return registro;
};

const iniciarGeneradorPalabraDiaria = () => {
    generarPalabraDelDia().catch((error) => {
        console.error('Error generando la palabra del dia:', error);
    });

    setInterval(() => {
        generarPalabraDelDia().catch((error) => {
            console.error('Error generando la palabra del dia:', error);
        });
    }, 60 * 60 * 1000);
};

module.exports = {
    generarPalabraDelDia,
    iniciarGeneradorPalabraDiaria
};
