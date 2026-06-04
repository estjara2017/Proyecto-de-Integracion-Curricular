// src/jobs/generateDailyCode.js
const DailyCode = require('../models/DailyCode');

const DICCIONARIO_CROSSFIT = [
    'WOD', 'BURPEE', 'AMRAP', 'THRUSTER', 'SNATCH', 'CLEAN', 'JERK',
    'KETTLEBELL', 'BOXJUMP', 'DEADLIFT', 'EMOM', 'TABATA', 'WALLBALL',
    'PULLUP', 'PUSHUP', 'SQUAT', 'CHINUP', 'METCON', 'ROPECLIMB'
];

const generarPalabraDelDia = async () => {
    try {
        const hoy = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        
        // Verificar si ya existe una palabra asignada para hoy
        const existe = await DailyCode.findOne({ where: { fecha: hoy } });
        
        if (!existe) {
            // Escoger palabra aleatoria
            const indiceAleatorio = Math.floor(Math.random() * DICCIONARIO_CROSSFIT.length);
            const palabraSeleccionada = DICCIONARIO_CROSSFIT[indiceAleatorio];

            await DailyCode.create({
                palabra: palabraSeleccionada,
                fecha: hoy
            });
            console.log(`🎰 [CRON JOB] Palabra clave del día generada: ${palabraSeleccionada}`);
        }
    } catch (error) {
        console.error('Error generando la palabra del día:', error);
    }
};

module.exports = generarPalabraDelDia;