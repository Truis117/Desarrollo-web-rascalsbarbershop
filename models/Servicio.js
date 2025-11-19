const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Servicio = sequelize.define('SERVICIO', {
    id_servicio: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_servicio: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    descripcion_larga: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada del servicio'
    },
    beneficios: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Beneficios del servicio separados por comas'
    },
    incluye: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Qué incluye el servicio separado por comas'
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duración en minutos'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'SERVICIO',
    timestamps: false,
    indexes: [
        { fields: ['precio'] },
        { fields: ['nombre_servicio'] }
    ]
});

module.exports = Servicio;
