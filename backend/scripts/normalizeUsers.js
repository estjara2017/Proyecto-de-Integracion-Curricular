require('dotenv').config();

const { sequelize } = require('../models/index');
const installUserNormalizationTrigger = require('../utils/installUserNormalizationTrigger');
const normalizeExistingUsers = require('../utils/normalizeExistingUsers');

const run = async () => {
    try {
        await sequelize.authenticate();
        await installUserNormalizationTrigger();
        await normalizeExistingUsers();
        console.log('Usuarios normalizados correctamente.');
    } catch (error) {
        console.error('Error al normalizar usuarios:', error.message);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
    }
};

run();
