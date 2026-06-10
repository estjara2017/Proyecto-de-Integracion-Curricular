const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Suscripcion = sequelize.define('Suscripcion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fechaInicio: { type: DataTypes.DATEONLY, allowNull: true },
    fechaFin: { type: DataTypes.DATEONLY, allowNull: true },
    estado: { type: DataTypes.STRING, defaultValue: 'pendiente' },
    diasTotalesDisponibles: { type: DataTypes.INTEGER, defaultValue: 0 },
    diasAsistidos: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Suscripcion;
