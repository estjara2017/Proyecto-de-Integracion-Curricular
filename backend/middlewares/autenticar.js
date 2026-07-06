// src/middlewares/autenticar.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ElementalCrossTraining_Secret_Key_2026';

const verificarToken = (req, res, next) => {
    // Capturamos el token que viene desde el frontend en los encabezados (Headers)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ 
            status: 'error', 
            message: 'Acceso denegado. No se proporcionó un token de sesión.' 
        });
    }

    try {
        // Validamos si el token es real y no ha expirado
        const verificado = jwt.verify(token, JWT_SECRET);
        
        // Inyectamos los datos decodificados (id y rol) en la petición 'req'
        req.usuarioLogueado = verificado;
        req.user = verificado;
        
        next(); // ¡Todo bien! Le da paso al controlador
    } catch (error) {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Token inválido o expirado. Inicia sesión nuevamente.' 
        });
    }
};

module.exports = verificarToken;
