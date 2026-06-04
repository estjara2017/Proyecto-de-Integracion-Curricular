const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Suscripcion = sequelize.define('Suscripcion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaInicio: { type: DataTypes.DATEONLY, allowNull: true },
    fechaFin: { type: DataTypes.DATEONLY, allowNull: true },
    diasTotalesDisponibles: { type: DataTypes.INTEGER, defaultValue: 0 }, // Aquí va el cálculo matemático
    diasAsistidos: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Suscripcion;