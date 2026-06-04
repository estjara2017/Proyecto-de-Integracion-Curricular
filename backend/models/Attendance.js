// src/models/Attendance.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { 
        type: DataTypes.DATEONLY, 
        allowNull: false,
        defaultValue: DataTypes.NOW // Guarda "YYYY-MM-DD" automáticamente
    },
    tipoRegistro: {
        type: DataTypes.STRING,
        defaultValue: 'AUTOPROPIO', // 'AUTOPROPIO' (por QR) o 'MANUAL_ADMIN' (por el Coach)
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['usuarioId', 'fecha'] // Evita duplicados diarios por usuario
        }
    ]
});

module.exports = Attendance;