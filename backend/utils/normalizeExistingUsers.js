const { Usuario } = require('../models/index');
const { normalizeUserTextFields, USER_NORMALIZED_FIELDS } = require('./textNormalization');

const normalizeExistingUsers = async () => {
    const usuarios = await Usuario.findAll();
    let updatedCount = 0;

    for (const usuario of usuarios) {
        const normalized = normalizeUserTextFields(usuario.dataValues);
        let hasChanges = false;

        for (const field of USER_NORMALIZED_FIELDS) {
            if (usuario[field] !== normalized[field]) {
                usuario[field] = normalized[field];
                hasChanges = true;
            }
        }

        if (hasChanges) {
            await usuario.save();
            updatedCount += 1;
        }
    }

    if (updatedCount > 0) {
        console.log(`Usuarios normalizados: ${updatedCount}`);
    }
};

module.exports = normalizeExistingUsers;
