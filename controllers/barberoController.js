const { Barbero, Cita } = require('../models');
const bcrypt = require('bcryptjs');

// C: Crear Barbero
exports.createBarbero = async (req, res) => {
    try {
        // Hashear la contraseña antes de crear el barbero
        if (req.body.contraseña) {
            req.body.contraseña = await bcrypt.hash(req.body.contraseña, 10);
        }
        
        const nuevoBarbero = await Barbero.create(req.body);
        
        // No devolver la contraseña en la respuesta
        const barberoResponse = nuevoBarbero.toJSON();
        delete barberoResponse.contraseña;
        
        res.status(201).json(barberoResponse);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el barbero.', details: error.message });
    }
};

// R: Obtener Todos los Barberos
exports.getAllBarberos = async (req, res) => {
    try {
        const barberos = await Barbero.findAll({
            attributes: { exclude: ['contraseña'] } // No devolver contraseñas
        });
        res.status(200).json(barberos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los barberos.', details: error.message });
    }
};

// R: Obtener Barbero por ID (incluyendo sus Citas)
exports.getBarberoById = async (req, res) => {
    try {
        const barbero = await Barbero.findByPk(req.params.id, {
            attributes: { exclude: ['contraseña'] }, // No devolver contraseña
            include: [{ model: Cita, as: 'CitasAgendadas' }]
        });
        if (barbero) {
            res.status(200).json(barbero);
        } else {
            res.status(404).json({ error: 'Barbero no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el barbero.', details: error.message });
    }
};

// U: Actualizar Barbero
exports.updateBarbero = async (req, res) => {
    try {
        // Si se está actualizando la contraseña, hashearla
        if (req.body.contraseña) {
            req.body.contraseña = await bcrypt.hash(req.body.contraseña, 10);
        }
        
        const [updatedRows] = await Barbero.update(req.body, {
            where: { id_barbero: req.params.id }
        });
        
        if (updatedRows) {
            const barberoActualizado = await Barbero.findByPk(req.params.id, {
                attributes: { exclude: ['contraseña'] }
            });
            res.status(200).json(barberoActualizado);
        } else {
            res.status(404).json({ error: 'Barbero no encontrado o sin cambios.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el barbero.', details: error.message });
    }
};

// D: Eliminar Barbero
exports.deleteBarbero = async (req, res) => {
    try {
        const deletedRows = await Barbero.destroy({
            where: { id_barbero: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Barbero no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el barbero.', details: error.message });
    }
};
