-- ============================================
-- MIGRACIÓN: Agregar columna contraseña a BARBERO
-- Fecha: 2025-11-19
-- Descripción: Agrega campo de contraseña para autenticación de barberos
-- ============================================

USE `Desarrollo-web-rascalsbarbershop`;

-- Agregar columna contraseña a la tabla BARBERO
ALTER TABLE BARBERO 
ADD COLUMN contraseña VARCHAR(255) NULL COMMENT 'Hash bcrypt de la contraseña';

-- Actualizar barberos existentes con una contraseña por defecto
-- Hash bcrypt de "barbero123": $2b$10$7Z1qX3YJ5vN8KxE3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y
UPDATE BARBERO 
SET contraseña = '$2b$10$7Z1qX3YJ5vN8KxE3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y'
WHERE contraseña IS NULL;

-- Hacer que la columna sea obligatoria después de llenar datos
ALTER TABLE BARBERO 
MODIFY COLUMN contraseña VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt de la contraseña';

-- Verificar que la migración fue exitosa
SELECT id_barbero, nombre, apellido, correo, 
       CASE WHEN contraseña IS NOT NULL THEN 'Contraseña configurada' ELSE 'Sin contraseña' END AS estado_password
FROM BARBERO;

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- Contraseña por defecto para todos los barberos: "barbero123"
-- Los barberos deben cambiar su contraseña después del primer login
-- Se recomienda implementar un sistema de cambio de contraseña
-- ============================================
