const Plan = require('../models/plan');

const cargarPlanesIniciales = async () => {
    try {
        const conteo = await Plan.count();
        if (conteo === 0) {
            await Plan.bulkCreate([
                { nombre: 'Plan Mensual', precio: 30.00, meses: 1, diasPorSemana: 5 },
                { nombre: 'Plan Trimestral', precio: 75.00, meses: 3, diasPorSemana: 5 },
                { nombre: 'Plan Semestral', precio: 140.00, meses: 6, diasPorSemana: 5 },
                { nombre: 'Plan Anual', precio: 260.00, meses: 12, diasPorSemana: 5 }
            ]);
            console.log('🌱 Base de datos: Planes iniciales creados con éxito.');
        }
    } catch (error) {
        console.error('Error al insertar los planes iniciales:', error);
    }
};

module.exports = cargarPlanesIniciales;