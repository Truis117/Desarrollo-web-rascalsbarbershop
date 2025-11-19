const { Servicio } = require('../models');

// C: Crear Servicio
exports.createServicio = async (req, res) => {
    try {
        const nuevoServicio = await Servicio.create(req.body);
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el servicio.', details: error.message });
    }
};

// R: Obtener Todos los Servicios
exports.getAllServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los servicios.', details: error.message });
    }
};

// R: Obtener Servicio por ID
exports.getServicioById = async (req, res) => {
    try {
        const servicio = await Servicio.findByPk(req.params.id);
        if (servicio) {
            res.status(200).json(servicio);
        } else {
            res.status(404).json({ error: 'Servicio no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el servicio.', details: error.message });
    }
};

// U: Actualizar Servicio
exports.updateServicio = async (req, res) => {
    try {
        const [updatedRows] = await Servicio.update(req.body, {
            where: { id_servicio: req.params.id }
        });
        if (updatedRows) {
            const servicioActualizado = await Servicio.findByPk(req.params.id);
            res.status(200).json(servicioActualizado);
        } else {
            res.status(404).json({ error: 'Servicio no encontrado o sin cambios.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el servicio.', details: error.message });
    }
};

// D: Eliminar Servicio
exports.deleteServicio = async (req, res) => {
    try {
        const deletedRows = await Servicio.destroy({
            where: { id_servicio: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Servicio no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el servicio.', details: error.message });
    }
};
