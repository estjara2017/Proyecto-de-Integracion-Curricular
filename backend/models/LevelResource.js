const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LevelResource = sequelize.define('LevelResource', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    tipo: {
        type: DataTypes.ENUM('video', 'rutina', 'plantilla'),
        allowNull: false,
        defaultValue: 'video'
    },
    url: { type: DataTypes.TEXT, allowNull: false },
    descripcion: { type: DataTypes.TEXT }
});

module.exports = LevelResource;
