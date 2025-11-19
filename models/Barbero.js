const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Barbero = sequelize.define('BARBERO', {
    id_barbero: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    disponibilidad: {
        type: DataTypes.STRING(50),
        defaultValue: 'Disponible'
    }
}, {
    tableName: 'BARBERO',
    timestamps: false,
    indexes: [
        { fields: ['disponibilidad'] },
        { fields: ['correo'] }
    ]
});

module.exports = Barbero;
