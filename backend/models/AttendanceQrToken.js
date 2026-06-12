const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttendanceQrToken = sequelize.define('AttendanceQrToken', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    palabra: { type: DataTypes.STRING, allowNull: false },
    expiraEn: { type: DataTypes.DATE, allowNull: false }
});

module.exports = AttendanceQrToken;
