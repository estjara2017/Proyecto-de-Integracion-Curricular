// src/middlewares/esAdmin.js

const esAdmin = (req, res, next) => {
    // 'req.usuarioLogueado' fue creado por el middleware anterior (verificarToken)
    if (!req.usuarioLogueado || req.usuarioLogueado.rol !== 'admin') {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
    }
    
    next(); // Es admin, continúa al controlador correspondiente
};

module.exports = esAdmin;