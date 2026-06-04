// src/models/DailyCode.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyCode = sequelize.define('DailyCode', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    palabra: { type: DataTypes.STRING, allowNull: false, uppercase: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false, unique: true }
});

module.exports = DailyCode;