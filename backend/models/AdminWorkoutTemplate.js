const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminWorkoutTemplate = sequelize.define('AdminWorkoutTemplate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    bloques: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = AdminWorkoutTemplate;
