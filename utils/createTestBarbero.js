require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Barbero, Usuario } = require('../models');

async function createTestBarbero() {
    try {
        await sequelize.authenticate();
        console.log('✓ Conectado a la base de datos');

        // Verificar si ya existe
        const existingUser = await Usuario.findOne({ 
            where: { email: 'barbero@test.com' } 
        });

        if (existingUser) {
            console.log('⚠️ El usuario barbero@test.com ya existe');
            process.exit(0);
        }

        // Crear barbero
        const barbero = await Barbero.create({
            nombre: 'Carlos',
            apellido: 'Ramírez',
            especialidad: 'Cortes modernos y diseño',
            correo: 'barbero@test.com',
            telefono: '555-1234',
            disponibilidad: 'Disponible'
        });

        console.log('✓ Barbero creado con ID:', barbero.id_barbero);

        // Crear usuario con contraseña hasheada
        const passwordHash = await bcrypt.hash('barbero123', 10);
        
        const usuario = await Usuario.create({
            email: 'barbero@test.com',
            password_hash: passwordHash,
            rol: 'BARBERO',
            id_barbero: barbero.id_barbero,
            id_cliente: null,
            activo: true
        });

        console.log('✓ Usuario barbero creado con ID:', usuario.id_usuario);
        console.log('\n==============================================');
        console.log('CREDENCIALES DE ACCESO:');
        console.log('Email: barbero@test.com');
        console.log('Password: barbero123');
        console.log('==============================================\n');

        process.exit(0);

    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

createTestBarbero();
