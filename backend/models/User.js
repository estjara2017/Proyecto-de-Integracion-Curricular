// src/models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const { normalizeEmail, normalizeUserTextFields, toUpperText } = require('../utils/textNormalization');

const setUpper = function setUpper(field, value) {
    this.setDataValue(field, toUpperText(value));
};

const setLowerEmail = function setLowerEmail(value) {
    this.setDataValue('correo', normalizeEmail(value));
};

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false, set(value) { setUpper.call(this, 'nombre', value); } },
    apellido: { type: DataTypes.STRING, allowNull: false, set(value) { setUpper.call(this, 'apellido', value); } },
    cedula: { type: DataTypes.STRING, unique: true, allowNull: false, set(value) { setUpper.call(this, 'cedula', value); } },
    correo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        set: setLowerEmail,
        validate: { isEmail: true }
    }, // Campo clave para el login con OTP
    telefono: {
        type: DataTypes.STRING,
        set(value) { setUpper.call(this, 'telefono', value); },
        validate: {
            soloNumeros(value) {
                if (value && !/^[0-9]+$/.test(value)) {
                    throw new Error('El telefono solo debe contener numeros.');
                }
            }
        }
    },
    peso: { type: DataTypes.FLOAT }, 
    estatura: { type: DataTypes.FLOAT }, 
    direccion: { type: DataTypes.STRING, set(value) { setUpper.call(this, 'direccion', value); } },
    fechaNacimiento: { type: DataTypes.DATEONLY },
    genero: { type: DataTypes.STRING, set(value) { setUpper.call(this, 'genero', value); } },
    poseeLesion: { type: DataTypes.STRING, defaultValue: 'NO', set(value) { setUpper.call(this, 'poseeLesion', value); } },
    detalleLesion: { type: DataTypes.TEXT, set(value) { setUpper.call(this, 'detalleLesion', value); } },
    
    // Configuración por defecto
    avatar: { type: DataTypes.STRING, defaultValue: 'agua' },
    nivel: { type: DataTypes.STRING, defaultValue: 'Principiante' },
    pesoLevantamientoKg: { type: DataTypes.FLOAT, defaultValue: 0 },
    pesoMaxPromedioKg: { type: DataTypes.FLOAT, defaultValue: 0 },
    porcentajeProgreso: { type: DataTypes.FLOAT, defaultValue: 0 },
    horarioEntrenamiento: { type: DataTypes.STRING },
    puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
    rol: { type: DataTypes.STRING, defaultValue: 'cliente' }, 
    estado: { type: DataTypes.STRING, defaultValue: 'inactivo' } 
}, {
    hooks: {
        beforeValidate: (usuario) => {
            const normalized = normalizeUserTextFields(usuario.dataValues);
            for (const [field, value] of Object.entries(normalized)) {
                usuario.setDataValue(field, value);
            }
        },
        beforeUpdate: (usuario) => {
            const normalized = normalizeUserTextFields(usuario.dataValues);
            for (const [field, value] of Object.entries(normalized)) {
                usuario.setDataValue(field, value);
            }
        }
    }
});

module.exports = Usuario;
