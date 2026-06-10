const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plan = sequelize.define('Plan', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    meses: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    duracionDias: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
    diasPorSemana: { type: DataTypes.INTEGER, defaultValue: 5 }
});

module.exports = Plan;
