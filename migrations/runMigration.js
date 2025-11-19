require('dotenv').config();
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

async function runMigration() {
    try {
        await sequelize.authenticate();
        console.log('✓ Conectado a la base de datos');

        // Verificar si la columna ya existe
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
            AND TABLE_NAME = 'BARBERO' 
            AND COLUMN_NAME = 'contraseña'
        `);

        if (results.length > 0) {
            console.log('⚠️  La columna "contraseña" ya existe en la tabla BARBERO');
            console.log('✓ Migración ya ejecutada previamente');
            process.exit(0);
        }

        console.log('→ Agregando columna "contraseña" a la tabla BARBERO...');
        
        // Agregar columna contraseña
        await sequelize.query(`
            ALTER TABLE BARBERO 
            ADD COLUMN contraseña VARCHAR(255) NULL COMMENT 'Hash bcrypt de la contraseña'
        `);

        console.log('✓ Columna agregada exitosamente');

        // Generar hash de la contraseña por defecto "barbero123"
        const defaultPassword = await bcrypt.hash('barbero123', 10);
        console.log('→ Actualizando barberos existentes con contraseña por defecto...');

        // Actualizar todos los barberos existentes
        await sequelize.query(`
            UPDATE BARBERO 
            SET contraseña = :password
            WHERE contraseña IS NULL
        `, {
            replacements: { password: defaultPassword }
        });

        console.log('✓ Barberos actualizados con contraseña por defecto');

        // Hacer la columna obligatoria
        await sequelize.query(`
            ALTER TABLE BARBERO 
            MODIFY COLUMN contraseña VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt de la contraseña'
        `);

        console.log('✓ Columna configurada como obligatoria');

        // Verificar resultado
        const [barberos] = await sequelize.query(`
            SELECT id_barbero, nombre, apellido, correo,
                   CASE WHEN contraseña IS NOT NULL THEN 'Configurada' ELSE 'Sin configurar' END AS estado_password
            FROM BARBERO
        `);

        console.log('\n==============================================');
        console.log('BARBEROS ACTUALIZADOS:');
        console.log('==============================================');
        barberos.forEach(b => {
            console.log(`ID: ${b.id_barbero} | ${b.nombre} ${b.apellido} | ${b.correo} | Password: ${b.estado_password}`);
        });
        console.log('==============================================');
        console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
        console.log('\nContraseña por defecto para todos: "barbero123"');
        console.log('Los barberos pueden iniciar sesión con su correo y esta contraseña\n');

        process.exit(0);

    } catch (error) {
        console.error('✗ Error en la migración:', error.message);
        console.error('Detalles:', error);
        process.exit(1);
    }
}

runMigration();
