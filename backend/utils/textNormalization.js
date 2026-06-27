const USER_UPPERCASE_FIELDS = [
    'nombre',
    'apellido',
    'cedula',
    'telefono',
    'direccion',
    'genero',
    'poseeLesion',
    'detalleLesion'
];

const USER_LOWERCASE_FIELDS = ['correo'];
const USER_NORMALIZED_FIELDS = [...USER_UPPERCASE_FIELDS, ...USER_LOWERCASE_FIELDS];
const PHONE_REGEX = /^[0-9]+$/;

const toUpperText = (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLocaleUpperCase('es-EC');
};

const toLowerText = (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().toLocaleLowerCase('es-EC');
};

const normalizeEmail = (correo) => toLowerText(correo);

const normalizeUserTextFields = (payload = {}) => {
    const normalized = { ...payload };

    for (const field of USER_UPPERCASE_FIELDS) {
        if (normalized[field] !== undefined && normalized[field] !== null) {
            normalized[field] = toUpperText(normalized[field]);
        }
    }

    for (const field of USER_LOWERCASE_FIELDS) {
        if (normalized[field] !== undefined && normalized[field] !== null) {
            normalized[field] = toLowerText(normalized[field]);
        }
    }

    return normalized;
};

const isValidPhone = (telefono) => {
    if (telefono === undefined || telefono === null || telefono === '') return true;
    return PHONE_REGEX.test(String(telefono).trim());
};

module.exports = {
    isValidPhone,
    normalizeEmail,
    normalizeUserTextFields,
    toLowerText,
    toUpperText,
    USER_LOWERCASE_FIELDS,
    USER_NORMALIZED_FIELDS,
    USER_UPPERCASE_FIELDS
};
