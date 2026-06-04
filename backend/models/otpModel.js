// src/models/otpRecord.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtpRecord = sequelize.define('OtpRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correo: { type: DataTypes.STRING, allowNull: false },
    codigo: { type: DataTypes.STRING(4), allowNull: false },
    expiraEn: { 
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 5 * 60 * 1000) // Expira automáticamente en 5 minutos
    }
});

module.exports = OtpRecord;