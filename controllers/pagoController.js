const { Pago, Cita } = require('../models');

// C: Crear Pago (Registrar un pago para una Cita)
exports.createPago = async (req, res) => {
    try {
        const nuevoPago = await Pago.create(req.body);
        res.status(201).json(nuevoPago);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el pago.', details: error.message });
    }
};

// R: Obtener Todos los Pagos (incluyendo información de Cita)
exports.getAllPagos = async (req, res) => {
    try {
        const pagos = await Pago.findAll({
            include: [{ model: Cita, as: 'Cita' }]
        });
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pagos.', details: error.message });
    }
};

// R: Obtener Pago por ID (incluyendo Cita)
exports.getPagoById = async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id, {
            include: [{ model: Cita, as: 'Cita' }]
        });
        if (pago) {
            res.status(200).json(pago);
        } else {
            res.status(404).json({ error: 'Pago no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pago.', details: error.message });
    }
};

// U: Actualizar Pago (ej. cambiar estado_pago)
exports.updatePago = async (req, res) => {
    try {
        const [updatedRows] = await Pago.update(req.body, {
            where: { id_pago: req.params.id }
        });
        if (updatedRows) {
            const pagoActualizado = await Pago.findByPk(req.params.id);
            res.status(200).json(pagoActualizado);
        } else {
            res.status(404).json({ error: 'Pago no encontrado o sin cambios.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el pago.', details: error.message });
    }
};

// D: Eliminar Pago
exports.deletePago = async (req, res) => {
    try {
        const deletedRows = await Pago.destroy({
            where: { id_pago: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Pago no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pago.', details: error.message });
    }
};
