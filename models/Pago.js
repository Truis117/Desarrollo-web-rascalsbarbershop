const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pago = sequelize.define('PAGO', {
    id_pago: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    id_cita: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Efectivo, Tarjeta, Transferencia, etc.'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    estado_pago: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Pendiente',
        comment: 'Pendiente, Completado, Fallido, Reembolsado'
    }
}, {
    tableName: 'PAGO',
    timestamps: false,
    indexes: [
        { fields: ['fecha_pago'] },
        { fields: ['estado_pago'] },
        { fields: ['id_cita'] }
    ]
});

module.exports = Pago;
