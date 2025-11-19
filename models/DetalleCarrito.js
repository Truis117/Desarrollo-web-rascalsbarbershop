const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleCarrito = sequelize.define('DETALLE_CARRITO', {
    id_detalle: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    id_carrito: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_servicio: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false
    }
}, {
    tableName: 'DETALLE_CARRITO',
    timestamps: false,
    indexes: [
        { fields: ['id_carrito'] },
        { fields: ['id_servicio'] }
    ]
});

module.exports = DetalleCarrito;
