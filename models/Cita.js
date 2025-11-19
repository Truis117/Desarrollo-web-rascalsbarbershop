const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cita = sequelize.define('CITA', {
    id_cita: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    id_cliente: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_barbero: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    id_servicio: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Pendiente',
        comment: 'Pendiente, Confirmada, Completada, Cancelada'
    }
}, {
    tableName: 'CITA',
    timestamps: false,
    indexes: [
        { fields: ['fecha', 'hora'] },
        { fields: ['estado'] },
        { fields: ['id_cliente'] },
        { fields: ['id_barbero'] }
    ]
});

module.exports = Cita;
