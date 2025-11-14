const { Cita, Cliente, Barbero, Servicio, Pago } = require('../models');

// C: Crear Cita
exports.createCita = async (req, res) => {
    try {
        const nuevaCita = await Cita.create(req.body);
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(400).json({ error: 'Error al agendar la cita.', details: error.message });
    }
};

// R: Obtener Todas las Citas (incluyendo Cliente, Barbero, Servicio y Pago)
exports.getAllCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                { model: Cliente, as: 'Cliente', attributes: ['nombre', 'apellido'] },
                { model: Barbero, as: 'Barbero', attributes: ['nombre', 'apellido', 'especialidad'] },
                { model: Servicio, as: 'Servicio', attributes: ['nombre_servicio', 'precio'] },
                { model: Pago, as: 'Pago' }
            ]
        });
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas.', details: error.message });
    }
};

// R: Obtener Cita por ID (incluyendo relaciones)
exports.getCitaById = async (req, res) => {
    try {
        const cita = await Cita.findByPk(req.params.id, {
            include: [
                { model: Cliente, as: 'Cliente' },
                { model: Barbero, as: 'Barbero' },
                { model: Servicio, as: 'Servicio' },
                { model: Pago, as: 'Pago' }
            ]
        });
        if (cita) {
            res.status(200).json(cita);
        } else {
            res.status(404).json({ error: 'Cita no encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cita.', details: error.message });
    }
};

// U: Actualizar Cita
exports.updateCita = async (req, res) => {
    try {
        const [updatedRows] = await Cita.update(req.body, {
            where: { id_cita: req.params.id }
        });
        if (updatedRows) {
            const citaActualizada = await Cita.findByPk(req.params.id);
            res.status(200).json(citaActualizada);
        } else {
            res.status(404).json({ error: 'Cita no encontrada o sin cambios.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la cita.', details: error.message });
    }
};

// D: Eliminar Cita
exports.deleteCita = async (req, res) => {
    try {
        const deletedRows = await Cita.destroy({
            where: { id_cita: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Cita no encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cita.', details: error.message });
    }
};
