const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminWorkoutTemplate = sequelize.define('AdminWorkoutTemplate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    etiqueta: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    objetivo: { type: DataTypes.STRING },
    tipoAsignacion: { type: DataTypes.STRING, defaultValue: 'general' },
    niveles: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
    usuarioIds: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
    lesionObjetivo: { type: DataTypes.TEXT },
    bloques: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
    diasSemana: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
    },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = AdminWorkoutTemplate;
