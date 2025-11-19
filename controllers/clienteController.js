const { Cliente, Cita, Carrito } = require('../models');

// C: Crear Cliente
exports.createCliente = async (req, res) => {
    try {
        const nuevoCliente = await Cliente.create(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el cliente.', details: error.message });
    }
};

// R: Obtener Todos los Clientes
exports.getAllClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los clientes.', details: error.message });
    }
};

// R: Obtener Cliente por ID (incluyendo Citas y Carritos)
exports.getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id, {
            include: [{ model: Cita, as: 'Citas' }, { model: Carrito, as: 'Carritos' }]
        });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente.', details: error.message });
    }
};

// U: Actualizar Cliente
exports.updateCliente = async (req, res) => {
    try {
        const [updatedRows] = await Cliente.update(req.body, {
            where: { id_cliente: req.params.id }
        });
        if (updatedRows) {
            const clienteActualizado = await Cliente.findByPk(req.params.id);
            res.status(200).json(clienteActualizado);
        } else {
            res.status(404).json({ error: 'Cliente no encontrado o sin cambios.' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el cliente.', details: error.message });
    }
};

// D: Eliminar Cliente
exports.deleteCliente = async (req, res) => {
    try {
        const deletedRows = await Cliente.destroy({
            where: { id_cliente: req.params.id }
        });
        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Cliente no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cliente.', details: error.message });
    }
};
