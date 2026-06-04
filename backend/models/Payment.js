const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define('Pago', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { 
        type: DataTypes.STRING, 
        defaultValue: 'pendiente' // 'pendiente', 'aprobado', 'rechazado'
    },
    fechaNotificacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Pago;