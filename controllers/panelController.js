const { Cita, Cliente, Barbero, Servicio, Pago } = require('../models');
const { Op } = require('sequelize');

// ============================================
// OBTENER ESTADÍSTICAS DEL PANEL
// ============================================
exports.getStatistics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Obtener fecha de inicio de semana (lunes)
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        // Citas de hoy
        const todayCitas = await Cita.count({
            where: {
                fecha: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        // Citas de esta semana
        const weeklyCitas = await Cita.count({
            where: {
                fecha: {
                    [Op.gte]: startOfWeek
                }
            }
        });

        // Citas pendientes
        const pendingCitas = await Cita.count({
            where: {
                estado: 'Pendiente'
            }
        });

        // Calcular ingresos del día (basado en citas completadas hoy)
        const todayRevenue = await Cita.findAll({
            where: {
                fecha: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                },
                estado: 'Completada'
            },
            include: [{
                model: Servicio,
                as: 'Servicio',
                attributes: ['precio']
            }]
        });

        const revenue = todayRevenue.reduce((sum, cita) => {
            return sum + (parseFloat(cita.Servicio?.precio) || 0);
        }, 0);

        res.json({
            todayCitas,
            weeklyCitas,
            pendingCitas,
            revenue: revenue.toFixed(3)
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas', details: error.message });
    }
};

// ============================================
// OBTENER TODAS LAS CITAS CON INFORMACIÓN COMPLETA
// ============================================
exports.getAllCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll({
            include: [
                {
                    model: Cliente,
                    as: 'Cliente',
                    attributes: ['nombre', 'apellido', 'telefono', 'correo']
                },
                {
                    model: Barbero,
                    as: 'Barbero',
                    attributes: ['nombre', 'apellido', 'especialidad']
                },
                {
                    model: Servicio,
                    as: 'Servicio',
                    attributes: ['nombre_servicio', 'precio', 'duracion']
                }
            ],
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });

        res.json(citas);

    } catch (error) {
        console.error('Error obteniendo citas:', error);
        res.status(500).json({ error: 'Error al obtener citas', details: error.message });
    }
};

// ============================================
// ACTUALIZAR ESTADO DE UNA CITA
// ============================================
exports.updateCitaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar estados permitidos
        const estadosPermitidos = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ 
                error: 'Estado inválido', 
                estadosPermitidos 
            });
        }

        const cita = await Cita.findByPk(id);

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        await cita.update({ estado });

        // Devolver cita actualizada con relaciones
        const citaActualizada = await Cita.findByPk(id, {
            include: [
                {
                    model: Cliente,
                    as: 'Cliente',
                    attributes: ['nombre', 'apellido']
                },
                {
                    model: Servicio,
                    as: 'Servicio',
                    attributes: ['nombre_servicio']
                }
            ]
        });

        res.json({ 
            message: 'Estado actualizado correctamente', 
            cita: citaActualizada 
        });

    } catch (error) {
        console.error('Error actualizando estado de cita:', error);
        res.status(500).json({ error: 'Error al actualizar cita', details: error.message });
    }
};

// ============================================
// OBTENER CITAS FILTRADAS POR FECHA
// ============================================
exports.getCitasByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = {};
        
        if (startDate && endDate) {
            whereClause.fecha = {
                [Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            whereClause.fecha = {
                [Op.gte]: startDate
            };
        }

        const citas = await Cita.findAll({
            where: whereClause,
            include: [
                {
                    model: Cliente,
                    as: 'Cliente',
                    attributes: ['nombre', 'apellido', 'telefono']
                },
                {
                    model: Barbero,
                    as: 'Barbero',
                    attributes: ['nombre', 'apellido']
                },
                {
                    model: Servicio,
                    as: 'Servicio',
                    attributes: ['nombre_servicio', 'precio']
                }
            ],
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });

        res.json(citas);

    } catch (error) {
        console.error('Error obteniendo citas por fecha:', error);
        res.status(500).json({ error: 'Error al filtrar citas', details: error.message });
    }
};
