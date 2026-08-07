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
    nombre: {
        type: DataTypes.STRING(60),
        allowNull: false,
        set(value) { setUpper.call(this, 'nombre', value); },
        validate: {
            longitudNombre(value) {
                if ((this.isNewRecord || this.changed('nombre')) && (String(value || '').length < 2 || String(value).length > 60)) {
                    throw new Error('El nombre debe contener entre 2 y 60 caracteres.');
                }
            }
        }
    },
    apellido: {
        type: DataTypes.STRING(80),
        allowNull: false,
        set(value) { setUpper.call(this, 'apellido', value); },
        validate: {
            longitudApellido(value) {
                if ((this.isNewRecord || this.changed('apellido')) && (String(value || '').length < 2 || String(value).length > 80)) {
                    throw new Error('El apellido debe contener entre 2 y 80 caracteres.');
                }
            }
        }
    },
    cedula: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false,
        set(value) { setUpper.call(this, 'cedula', value); },
        validate: {
            soloNumeros(value) {
                if (!/^[0-9]{1,10}$/.test(value)) {
                    throw new Error('La cedula debe contener entre 1 y 10 numeros enteros.');
                }
            }
        }
    },
    correo: {
        type: DataTypes.STRING(254),
        unique: true,
        allowNull: false,
        set: setLowerEmail,
        validate: {
            isEmail: true,
            longitudCorreo(value) {
                if ((this.isNewRecord || this.changed('correo')) && (String(value || '').length < 5 || String(value).length > 254)) {
                    throw new Error('El correo debe contener entre 5 y 254 caracteres.');
                }
            }
        }
    }, // Campo clave para el login con OTP
    telefono: {
        type: DataTypes.STRING(10),
        set(value) { setUpper.call(this, 'telefono', value); },
        validate: {
            soloNumeros(value) {
                if (value && !/^[0-9]{1,10}$/.test(value)) {
                    throw new Error('El telefono debe contener entre 1 y 10 numeros enteros.');
                }
            }
        }
    },
    peso: { type: DataTypes.FLOAT }, 
    estatura: { type: DataTypes.FLOAT }, 
    direccion: {
        type: DataTypes.STRING(150),
        set(value) { setUpper.call(this, 'direccion', value); },
        validate: {
            longitudDireccion(value) {
                if (value && (this.isNewRecord || this.changed('direccion')) && (value.length < 2 || value.length > 150)) {
                    throw new Error('La direccion debe contener entre 2 y 150 caracteres.');
                }
            }
        }
    },
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
