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

// Endpoint especial para booking desde el formulario web
exports.createBooking = async (req, res) => {
    console.log('📅 Booking request recibido:', req.body);
    
    try {
        const { nombre_completo, telefono, id_barbero, id_servicio, fecha, hora } = req.body;

        // Validar datos requeridos
        if (!nombre_completo || !id_barbero || !id_servicio || !fecha || !hora) {
            console.log('❌ Validación fallida - Datos faltantes');
            return res.status(400).json({ 
                error: 'Faltan datos requeridos.',
                required: ['nombre_completo', 'id_barbero', 'id_servicio', 'fecha', 'hora']
            });
        }

        // Separar nombre y apellido
        const nombreParts = nombre_completo.trim().split(' ');
        const nombre = nombreParts[0];
        const apellido = nombreParts.slice(1).join(' ') || nombre;

        // Generar email temporal si no existe
        const emailTemp = `${nombre.toLowerCase()}.${apellido.toLowerCase()}@temp.booking`;
        
        // Buscar o crear cliente
        let cliente = await Cliente.findOne({ 
            where: { 
                nombre: nombre,
                apellido: apellido
            } 
        });

        if (!cliente) {
            // Crear nuevo cliente
            cliente = await Cliente.create({
                nombre: nombre,
                apellido: apellido,
                correo: emailTemp,
                telefono: telefono || null,
                contraseña: 'temporal123', // Contraseña temporal
                direccion: null
            });
        } else {
            // Actualizar teléfono si se proporcionó uno nuevo
            if (telefono && telefono !== cliente.telefono) {
                await cliente.update({ telefono: telefono });
            }
        }

        // Verificar que el barbero existe
        const barbero = await Barbero.findByPk(id_barbero);
        if (!barbero) {
            return res.status(404).json({ error: 'Barbero no encontrado.' });
        }

        // Verificar que el servicio existe
        const servicio = await Servicio.findByPk(id_servicio);
        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado.' });
        }

        // Verificar disponibilidad (no hay otra cita en la misma fecha/hora con el mismo barbero)
        const citaExistente = await Cita.findOne({
            where: {
                id_barbero: id_barbero,
                fecha: fecha,
                hora: hora,
                estado: ['Pendiente', 'Confirmada']
            }
        });

        if (citaExistente) {
            return res.status(409).json({ 
                error: 'El barbero ya tiene una cita agendada en ese horario. Por favor seleccione otra hora.' 
            });
        }

        // Crear la cita
        const nuevaCita = await Cita.create({
            id_cliente: cliente.id_cliente,
            id_barbero: id_barbero,
            id_servicio: id_servicio,
            fecha: fecha,
            hora: hora,
            estado: 'Pendiente'
        });

        // Obtener cita completa con relaciones
        const citaCompleta = await Cita.findByPk(nuevaCita.id_cita, {
            include: [
                { model: Cliente, as: 'Cliente', attributes: ['nombre', 'apellido', 'telefono'] },
                { model: Barbero, as: 'Barbero', attributes: ['nombre', 'apellido', 'especialidad'] },
                { model: Servicio, as: 'Servicio', attributes: ['nombre_servicio', 'precio', 'duracion'] }
            ]
        });

        res.status(201).json({
            message: 'Cita agendada exitosamente.',
            cita: citaCompleta
        });

    } catch (error) {
        console.error('Error en booking:', error);
        res.status(500).json({ error: 'Error al agendar la cita.', details: error.message });
    }
};
