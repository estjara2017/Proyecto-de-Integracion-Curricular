const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Level = sequelize.define('Level', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    orden: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    mesesRequeridos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    pesoMaximoBaseLb: { type: DataTypes.FLOAT, allowNull: false },
    rendimientoMinimo: { type: DataTypes.FLOAT, allowNull: false },
    rendimientoEsperado: { type: DataTypes.FLOAT, allowNull: false },
    puntosParaAscenso: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Level;
