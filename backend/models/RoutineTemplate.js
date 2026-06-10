const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoutineTemplate = sequelize.define('RoutineTemplate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    objetivo: { type: DataTypes.STRING },
    semanaCiclo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    escalaPeso: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    diasSemana: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = RoutineTemplate;
