const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('USUARIO', {
    id_usuario: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Hash bcrypt de la contraseña'
    },
    rol: {
        type: DataTypes.ENUM('CLIENTE', 'BARBERO'),
        allowNull: false
    },
    id_cliente: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'Referencia a CLIENTE si rol es CLIENTE'
    },
    id_barbero: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        comment: 'Referencia a BARBERO si rol es BARBERO'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    ultimo_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'USUARIO',
    timestamps: false,
    indexes: [
        { fields: ['email'] },
        { fields: ['rol'] },
        { fields: ['activo'] }
    ]
});

module.exports = Usuario;
