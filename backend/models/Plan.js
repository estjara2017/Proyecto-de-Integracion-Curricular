const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plan = sequelize.define('Plan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true }, // Ej: 'Plan Trimestral'
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },       // Ej: 75.00
    meses: { type: DataTypes.INTEGER, allowNull: false },                // Ej: 3 (para el cálculo de días)
    diasPorSemana: { type: DataTypes.INTEGER, defaultValue: 5 }          // Tus 5 días reglamentarios a la semana
});

module.exports = Plan;