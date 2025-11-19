const { DetalleCarrito, Carrito, Servicio } = require('../models');

// C: Crear Detalle (Agregar un servicio a un carrito)
exports.createDetalleCarrito = async (req, res) => {
    try {
        const nuevoDetalle = await DetalleCarrito.create(req.body);
        res.status(201).json(nuevoDetalle);
    } catch (error) {
        res.status(400).json({ error: 'Error al agregar el detalle al carrito.', details: error.message });
    }
};

// R: Obtener Todos los Detalles (incluyendo Carrito y Servicio)
exports.getAllDetallesCarrito = async (req, res) => {
    try {
        const detalles = await DetalleCarrito.findAll({
            include: [
                { model: Carrito, as: 'Carrito', attributes: ['id_cliente', 'total'] },
                { model: Servicio, as: 'Servicio', attributes: ['nombre_servicio', 'precio'] }
            ]
        });
        res.status(200).json(detalles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detalles de carrito.', details: error.message });
    }
};

// U: Actualizar Detalle (ej. cambiar cantidad)
exports.updateDetalleCarrito = async (req, res) => {
    try {
        const [updatedRows] = await DetalleCarrito.update(req.body, {
            where: { id_detalle: req.params.id }
        });
        if (updatedRows) {
            const detalleActualizado = await DetalleCarrito.findByPk(req.params.id);
            res.status(200).json(detalleActualizado);
        } else {
            res.status(404).json({ error: 'Detalle no encontrado o sin cambios.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el detalle.', details: error.message });
    }
};

// D: Eliminar Detalle (Remover un servicio del carrito)
exports.deleteDetalleCarrito = async (req, res) => {
    try {
        const deletedRows = await DetalleCarrito.destroy({
            where: { id_detalle: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Detalle no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el detalle.', details: error.message });
    }
};
