const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OtpRecord = sequelize.define('OtpRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    correo: { type: DataTypes.STRING, allowNull: false },
    codigo: { type: DataTypes.STRING(4), allowNull: false },
    expiraEn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 5 * 60 * 1000)
    },
    intentos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    usado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
});

module.exports = OtpRecord;
