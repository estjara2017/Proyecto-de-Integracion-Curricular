// src/models/index.js
const sequelize = require('../config/database'); // Tu conexión a Postgres

// 1. Importar todos tus modelos individuales
const Usuario = require('./User');
const Plan = require('./Plan');
const Suscripcion = require('./planUsuario'); // O el nombre que le des a la tabla intermedia
const Pago = require('./Payment');
const Attendance = require('./Attendance');
const DailyCode = require('./DailyCode');
const OtpModel = require('./otpModel');
const Level = require('./Level');
const LevelResource = require('./LevelResource');
const RoutineTemplate = require('./RoutineTemplate');
const AdminWorkoutTemplate = require('./AdminWorkoutTemplate');

// 2. Definir las relaciones (Aquí se estructuran las llaves foráneas en Postgres)
Usuario.hasMany(Suscripcion, { foreignKey: 'usuarioId' });
Suscripcion.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Plan.hasMany(Suscripcion, { foreignKey: 'planId' });
Suscripcion.belongsTo(Plan, { foreignKey: 'planId' });

Suscripcion.hasMany(Pago, { foreignKey: 'suscripcionId' });
Pago.belongsTo(Suscripcion, { foreignKey: 'suscripcionId' });

Usuario.hasMany(Attendance, { foreignKey: 'usuarioId' });
Attendance.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Level.hasMany(LevelResource, { foreignKey: 'levelId' });
LevelResource.belongsTo(Level, { foreignKey: 'levelId' });

Level.hasMany(RoutineTemplate, { foreignKey: 'levelId' });
RoutineTemplate.belongsTo(Level, { foreignKey: 'levelId' });

// 3. Exportar todo unificado
module.exports = {
    sequelize,
    Usuario,
    Plan,
    Suscripcion,
    Pago,
    Attendance,
    DailyCode,
    OtpModel,
    Level,
    LevelResource,
    RoutineTemplate,
    AdminWorkoutTemplate
};
