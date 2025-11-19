const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Carrito = sequelize.define('CARRITO', {
    id_carrito: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    id_cliente: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false,
        defaultValue: 0.000
    },
    fecha_creacion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'CARRITO',
    timestamps: false,
    indexes: [
        { fields: ['id_cliente'] },
        { fields: ['fecha_creacion'] }
    ]
});

module.exports = Carrito;
