const { sequelize } = require('../config/database');

// Importar todos los modelos
const Cliente = require('./Cliente');
const Barbero = require('./Barbero');
const Usuario = require('./Usuario');
const Servicio = require('./Servicio');
const Cita = require('./Cita');
const Carrito = require('./Carrito');
const DetalleCarrito = require('./DetalleCarrito');
const Pago = require('./Pago');

// ============================================
// DEFINICIÓN DE RELACIONES ENTRE MODELOS
// ============================================

// Usuario -> Cliente (uno a uno)
Usuario.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'Cliente' });
Cliente.hasOne(Usuario, { foreignKey: 'id_cliente', as: 'Usuario' });

// Usuario -> Barbero (uno a uno)
Usuario.belongsTo(Barbero, { foreignKey: 'id_barbero', as: 'Barbero' });
Barbero.hasOne(Usuario, { foreignKey: 'id_barbero', as: 'Usuario' });

// Cliente -> Citas (uno a muchos)
Cliente.hasMany(Cita, { foreignKey: 'id_cliente', as: 'Citas' });
Cita.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'Cliente' });

// Barbero -> Citas (uno a muchos)
Barbero.hasMany(Cita, { foreignKey: 'id_barbero', as: 'CitasAgendadas' });
Cita.belongsTo(Barbero, { foreignKey: 'id_barbero', as: 'Barbero' });

// Servicio -> Citas (uno a muchos)
Servicio.hasMany(Cita, { foreignKey: 'id_servicio', as: 'Citas' });
Cita.belongsTo(Servicio, { foreignKey: 'id_servicio', as: 'Servicio' });

// Cliente -> Carritos (uno a muchos)
Cliente.hasMany(Carrito, { foreignKey: 'id_cliente', as: 'Carritos' });
Carrito.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'Cliente' });

// Carrito -> DetalleCarrito (uno a muchos)
Carrito.hasMany(DetalleCarrito, { foreignKey: 'id_carrito', as: 'Detalles' });
DetalleCarrito.belongsTo(Carrito, { foreignKey: 'id_carrito', as: 'Carrito' });

// Servicio -> DetalleCarrito (uno a muchos)
Servicio.hasMany(DetalleCarrito, { foreignKey: 'id_servicio', as: 'DetallesCarrito' });
DetalleCarrito.belongsTo(Servicio, { foreignKey: 'id_servicio', as: 'Servicio' });

// Cita -> Pago (uno a uno)
Cita.hasOne(Pago, { foreignKey: 'id_cita', as: 'Pago' });
Pago.belongsTo(Cita, { foreignKey: 'id_cita', as: 'Cita' });

// Exportar todos los modelos y la instancia de sequelize
module.exports = {
    sequelize,
    Cliente,
    Barbero,
    Usuario,
    Servicio,
    Cita,
    Carrito,
    DetalleCarrito,
    Pago
};
