const { Barbero, Cita } = require('../models');

// C: Crear Barbero
exports.createBarbero = async (req, res) => {
    try {
        const nuevoBarbero = await Barbero.create(req.body);
        res.status(201).json(nuevoBarbero);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el barbero.', details: error.message });
    }
};

// R: Obtener Todos los Barberos
exports.getAllBarberos = async (req, res) => {
    try {
        const barberos = await Barbero.findAll();
        res.status(200).json(barberos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los barberos.', details: error.message });
    }
};

// R: Obtener Barbero por ID (incluyendo sus Citas)
exports.getBarberoById = async (req, res) => {
    try {
        const barbero = await Barbero.findByPk(req.params.id, {
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
        const [updatedRows] = await Barbero.update(req.body, {
            where: { id_barbero: req.params.id }
        });
        if (updatedRows) {
            const barberoActualizado = await Barbero.findByPk(req.params.id);
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
