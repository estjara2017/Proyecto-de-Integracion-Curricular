// src/models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    cedula: { type: DataTypes.STRING, unique: true, allowNull: false },
    correo: { type: DataTypes.STRING, unique: true, allowNull: false }, // Campo clave para el login con OTP
    telefono: { type: DataTypes.STRING },
    peso: { type: DataTypes.FLOAT }, 
    estatura: { type: DataTypes.FLOAT }, 
    direccion: { type: DataTypes.STRING },
    fechaNacimiento: { type: DataTypes.DATEONLY },
    genero: { type: DataTypes.STRING },
    poseeLesion: { type: DataTypes.STRING, defaultValue: 'NO' },
    detalleLesion: { type: DataTypes.TEXT },
    
    // Configuración por defecto
    avatar: { type: DataTypes.STRING, defaultValue: 'agua' },
    nivel: { type: DataTypes.STRING, defaultValue: 'Principiante' }, 
    puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
    rol: { type: DataTypes.STRING, defaultValue: 'cliente' }, 
    estado: { type: DataTypes.STRING, defaultValue: 'inactivo' } 
});

module.exports = Usuario;