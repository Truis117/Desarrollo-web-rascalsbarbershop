// Middleware simple de autenticación
// En producción, implementar con JWT o sesiones según necesidades

const { Usuario } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        // Ejemplo básico: verificar si el usuario existe por ID en headers
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ error: 'No autenticado. Se requiere x-user-id en headers.' });
        }

        const usuario = await Usuario.findByPk(userId);

        if (!usuario || !usuario.activo) {
            return res.status(401).json({ error: 'Usuario no válido o inactivo.' });
        }

        // Adjuntar usuario al objeto request
        req.user = usuario;
        next();

    } catch (error) {
        res.status(500).json({ error: 'Error en autenticación.', details: error.message });
    }
};

// Middleware para verificar rol de BARBERO
const requireBarbero = (req, res, next) => {
    if (req.user && req.user.rol === 'BARBERO') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de BARBERO.' });
    }
};

// Middleware para verificar rol de CLIENTE
const requireCliente = (req, res, next) => {
    if (req.user && req.user.rol === 'CLIENTE') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de CLIENTE.' });
    }
};

module.exports = {
    authMiddleware,
    requireBarbero,
    requireCliente
};
