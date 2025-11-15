const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define('CLIENTE', {
    id_cliente: {
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
        allowNull: false,
        comment: 'Hash de la contraseña'
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'CLIENTE',
    timestamps: false,
    indexes: [
        { fields: ['correo'] },
        { fields: ['fecha_registro'] }
    ]
});

module.exports = Cliente;
