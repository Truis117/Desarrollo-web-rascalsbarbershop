require('dotenv').config();
const { sequelize } = require('../config/database');

async function runMigration() {
    try {
        await sequelize.authenticate();
        console.log('✓ Conectado a la base de datos');

        // Verificar si las columnas ya existen
        const [results] = await sequelize.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
            AND TABLE_NAME = 'SERVICIO' 
            AND COLUMN_NAME = 'descripcion_larga'
        `);

        if (results.length > 0) {
            console.log('⚠️  Las columnas ya existen en la tabla SERVICIO');
            console.log('✓ Migración ya ejecutada previamente');
            process.exit(0);
        }

        console.log('→ Agregando campos adicionales a la tabla SERVICIO...');
        
        // Agregar columnas
        await sequelize.query(`
            ALTER TABLE SERVICIO 
            ADD COLUMN descripcion_larga TEXT COMMENT 'Descripción detallada del servicio',
            ADD COLUMN beneficios TEXT COMMENT 'Beneficios del servicio separados por comas',
            ADD COLUMN incluye TEXT COMMENT 'Qué incluye el servicio separado por comas'
        `);

        console.log('✓ Columnas agregadas exitosamente');

        // Actualizar servicios existentes con datos de ejemplo
        console.log('→ Actualizando servicios existentes con información detallada...');

        await sequelize.query(`
            UPDATE SERVICIO 
            SET descripcion_larga = CASE nombre_servicio
                WHEN 'Corte Clásico' THEN 'Un corte de cabello profesional adaptado a tu estilo personal. Nuestros barberos expertos te asesorarán sobre el mejor estilo según la forma de tu rostro y tipo de cabello.'
                WHEN 'Corte + Barba' THEN 'Paquete completo de grooming que incluye corte de cabello y diseño de barba. Ideal para mantener un look impecable y bien cuidado.'
                WHEN 'Afeitado Tradicional' THEN 'Experiencia de barbería clásica con afeitado a navaja. Incluye preparación con toalla caliente y productos premium para un afeitado suave y sin irritación.'
                WHEN 'Tinte' THEN 'Cambia tu look con nuestro servicio de coloración profesional. Usamos productos de alta calidad que respetan tu cabello mientras logran el color deseado.'
                ELSE 'Servicio profesional de barbería con atención personalizada.'
            END,
            beneficios = CASE nombre_servicio
                WHEN 'Corte Clásico' THEN 'Look renovado,Asesoría personalizada,Técnicas profesionales,Acabado perfecto'
                WHEN 'Corte + Barba' THEN 'Look completo,Ahorro de tiempo,Diseño personalizado,Líneas definidas'
                WHEN 'Afeitado Tradicional' THEN 'Afeitado al ras,Experiencia relajante,Sin irritación,Piel suave'
                WHEN 'Tinte' THEN 'Color uniforme,Cobertura de canas,Productos premium,Resultado duradero'
                ELSE 'Servicio de calidad,Atención profesional'
            END,
            incluye = CASE nombre_servicio
                WHEN 'Corte Clásico' THEN 'Consulta de estilo,Lavado,Corte con tijeras y/o máquina,Secado y peinado'
                WHEN 'Corte + Barba' THEN 'Corte de cabello completo,Diseño y recorte de barba,Perfilado con navaja,Productos de acabado'
                WHEN 'Afeitado Tradicional' THEN 'Preparación con toalla caliente,Afeitado con navaja,Mascarilla post-afeitado,Bálsamo hidratante'
                WHEN 'Tinte' THEN 'Consulta de color,Aplicación de tinte profesional,Tratamiento acondicionador,Corte y peinado'
                ELSE 'Servicio completo'
            END
            WHERE descripcion_larga IS NULL
        `);

        console.log('✓ Servicios actualizados con información detallada');

        // Verificar resultado
        const [servicios] = await sequelize.query(`
            SELECT id_servicio, nombre_servicio, 
                   CASE WHEN descripcion_larga IS NOT NULL THEN 'Completo' ELSE 'Incompleto' END AS estado
            FROM SERVICIO
        `);

        console.log('\n==============================================');
        console.log('SERVICIOS ACTUALIZADOS:');
        console.log('==============================================');
        servicios.forEach(s => {
            console.log(`ID: ${s.id_servicio} | ${s.nombre_servicio} | Estado: ${s.estado}`);
        });
        console.log('==============================================');
        console.log('\n✅ MIGRACIÓN COMPLETADA EXITOSAMENTE\n');

        process.exit(0);

    } catch (error) {
        console.error('✗ Error en la migración:', error.message);
        console.error('Detalles:', error);
        process.exit(1);
    }
}

runMigration();
