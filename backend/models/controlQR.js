// src/models/controlQR.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ControlQR = sequelize.define('ControlQR', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, unique: true },
    codigoSecreto: { type: DataTypes.STRING(3), allowNull: false } // El código de 3 dígitos generado por el admin
});

module.exports = ControlQR;