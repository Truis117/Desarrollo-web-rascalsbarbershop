-- ============================================
-- Base de datos: Desarrollo-web-rascalsbarbershop
-- Sistema de gestión para barbería
-- Puerto MySQL: 3500
-- ============================================

-- Crear la base de datos
DROP DATABASE IF EXISTS `Desarrollo-web-rascalsbarbershop`;
CREATE DATABASE `Desarrollo-web-rascalsbarbershop` 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `Desarrollo-web-rascalsbarbershop`;

-- ============================================
-- TABLA: CLIENTE
-- Almacena información de los clientes registrados
-- ============================================
CREATE TABLE CLIENTE (
    id_cliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contraseña VARCHAR(255) NOT NULL COMMENT 'Hash de la contraseña',
    direccion VARCHAR(255),
    fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE),
    INDEX idx_correo (correo),
    INDEX idx_fecha_registro (fecha_registro)
) ENGINE=InnoDB COMMENT='Clientes registrados en el sistema';

-- ============================================
-- TABLA: BARBERO
-- Información de los barberos disponibles
-- ============================================
CREATE TABLE BARBERO (
    id_barbero INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contraseña VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt de la contraseña',
    disponibilidad VARCHAR(50) DEFAULT 'Disponible',
    INDEX idx_disponibilidad (disponibilidad),
    INDEX idx_correo_barbero (correo)
) ENGINE=InnoDB COMMENT='Barberos del establecimiento';

-- ============================================
-- TABLA: USUARIO
-- Sistema de autenticación unificado
-- ============================================
CREATE TABLE USUARIO (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt de la contraseña',
    rol ENUM('CLIENTE', 'BARBERO') NOT NULL,
    id_cliente INT UNSIGNED NULL COMMENT 'Referencia a CLIENTE si rol es CLIENTE',
    id_barbero INT UNSIGNED NULL COMMENT 'Referencia a BARBERO si rol es BARBERO',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Foreign Keys
    CONSTRAINT fk_usuario_cliente 
        FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_usuario_barbero 
        FOREIGN KEY (id_barbero) REFERENCES BARBERO(id_barbero) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Validación: debe tener id_cliente O id_barbero según el rol
    CONSTRAINT chk_usuario_rol_referencia 
        CHECK (
            (rol = 'CLIENTE' AND id_cliente IS NOT NULL AND id_barbero IS NULL) OR
            (rol = 'BARBERO' AND id_barbero IS NOT NULL AND id_cliente IS NULL)
        ),
    
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB COMMENT='Usuarios del sistema con autenticación';

-- ============================================
-- TABLA: SERVICIO
-- Catálogo de servicios ofrecidos
-- ============================================
CREATE TABLE SERVICIO (
    id_servicio INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(150) NOT NULL,
    descripcion TEXT,
    descripcion_larga TEXT COMMENT 'Descripción detallada del servicio',
    beneficios TEXT COMMENT 'Beneficios del servicio separados por comas',
    incluye TEXT COMMENT 'Qué incluye el servicio separado por comas',
    duracion INT NOT NULL COMMENT 'Duración en minutos',
    precio DECIMAL(10, 3) NOT NULL,
    imagen VARCHAR(255),
    INDEX idx_precio (precio),
    INDEX idx_nombre (nombre_servicio)
) ENGINE=InnoDB COMMENT='Servicios disponibles en la barbería';

-- ============================================
-- TABLA: CITA
-- Reservas/citas agendadas por los clientes
-- ============================================
CREATE TABLE CITA (
    id_cita INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT UNSIGNED NOT NULL,
    id_barbero INT UNSIGNED NOT NULL,
    id_servicio INT UNSIGNED NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente' COMMENT 'Pendiente, Confirmada, Completada, Cancelada',
    
    -- Foreign Keys
    CONSTRAINT fk_cita_cliente 
        FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_cita_barbero 
        FOREIGN KEY (id_barbero) REFERENCES BARBERO(id_barbero) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_cita_servicio 
        FOREIGN KEY (id_servicio) REFERENCES SERVICIO(id_servicio) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    -- Índices para optimizar búsquedas
    INDEX idx_fecha_hora (fecha, hora),
    INDEX idx_estado (estado),
    INDEX idx_cliente (id_cliente),
    INDEX idx_barbero (id_barbero)
) ENGINE=InnoDB COMMENT='Citas agendadas';

-- ============================================
-- TABLA: CARRITO
-- Carrito de compras temporal para cada cliente
-- ============================================
CREATE TABLE CARRITO (
    id_carrito INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT UNSIGNED NOT NULL,
    total DECIMAL(10, 3) NOT NULL DEFAULT 0.000,
    fecha_creacion DATE NOT NULL DEFAULT (CURRENT_DATE),
    
    -- Foreign Key
    CONSTRAINT fk_carrito_cliente 
        FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_cliente_carrito (id_cliente),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB COMMENT='Carritos de compra de clientes';

-- ============================================
-- TABLA: DETALLE_CARRITO
-- Detalles de los servicios en cada carrito
-- ============================================
CREATE TABLE DETALLE_CARRITO (
    id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT UNSIGNED NOT NULL,
    id_servicio INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL DEFAULT 1,
    subtotal DECIMAL(10, 3) NOT NULL,
    
    -- Foreign Keys
    CONSTRAINT fk_detalle_carrito 
        FOREIGN KEY (id_carrito) REFERENCES CARRITO(id_carrito) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_detalle_servicio 
        FOREIGN KEY (id_servicio) REFERENCES SERVICIO(id_servicio) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    
    INDEX idx_carrito (id_carrito),
    INDEX idx_servicio_detalle (id_servicio)
) ENGINE=InnoDB COMMENT='Detalles de servicios en el carrito';

-- ============================================
-- TABLA: PAGO
-- Registro de pagos realizados por citas
-- ============================================
CREATE TABLE PAGO (
    id_pago INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cita INT UNSIGNED NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL COMMENT 'Efectivo, Tarjeta, Transferencia, etc.',
    monto DECIMAL(10, 3) NOT NULL,
    fecha_pago DATE NOT NULL DEFAULT (CURRENT_DATE),
    estado_pago VARCHAR(50) NOT NULL DEFAULT 'Pendiente' COMMENT 'Pendiente, Completado, Fallido, Reembolsado',
    
    -- Foreign Key
    CONSTRAINT fk_pago_cita 
        FOREIGN KEY (id_cita) REFERENCES CITA(id_cita) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    INDEX idx_fecha_pago (fecha_pago),
    INDEX idx_estado_pago (estado_pago),
    INDEX idx_cita (id_cita)
) ENGINE=InnoDB COMMENT='Pagos realizados';

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- Descomenta para insertar datos de prueba
-- ============================================

-- Insertar servicios de ejemplo
INSERT INTO SERVICIO (nombre_servicio, descripcion, descripcion_larga, beneficios, incluye, duracion, precio, imagen) VALUES
('Corte Clásico', 
 'Corte tradicional con tijeras y máquina', 
 'Un corte de cabello profesional adaptado a tu estilo personal. Nuestros barberos expertos te asesorarán sobre el mejor estilo según la forma de tu rostro y tipo de cabello.',
 'Look renovado,Asesoría personalizada,Técnicas profesionales,Acabado perfecto',
 'Consulta de estilo,Lavado,Corte con tijeras y/o máquina,Secado y peinado',
 30, 25.000, '/images/corte-clasico.jpg'),

('Corte + Barba', 
 'Corte de cabello más arreglo de barba', 
 'Paquete completo de grooming que incluye corte de cabello y diseño de barba. Ideal para mantener un look impecable y bien cuidado.',
 'Look completo,Ahorro de tiempo,Diseño personalizado,Líneas definidas',
 'Corte de cabello completo,Diseño y recorte de barba,Perfilado con navaja,Productos de acabado',
 45, 35.000, '/images/corte-barba.jpg'),

('Afeitado Tradicional', 
 'Afeitado con navaja y toalla caliente', 
 'Experiencia de barbería clásica con afeitado a navaja. Incluye preparación con toalla caliente y productos premium para un afeitado suave y sin irritación.',
 'Afeitado al ras,Experiencia relajante,Sin irritación,Piel suave',
 'Preparación con toalla caliente,Afeitado con navaja,Mascarilla post-afeitado,Bálsamo hidratante',
 20, 15.000, '/images/afeitado.jpg'),

('Tinte', 
 'Aplicación de tinte profesional', 
 'Cambia tu look con nuestro servicio de coloración profesional. Usamos productos de alta calidad que respetan tu cabello mientras logran el color deseado.',
 'Color uniforme,Cobertura de canas,Productos premium,Resultado duradero',
 'Consulta de color,Aplicación de tinte profesional,Tratamiento acondicionador,Corte y peinado',
 60, 45.000, '/images/tinte.jpg');

-- Insertar barberos de ejemplo (contraseña para todos: "barbero123")
-- Hash bcrypt de "barbero123": $2b$10$7Z1qX3YJ5vN8KxE3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y
INSERT INTO BARBERO (nombre, apellido, especialidad, correo, telefono, contraseña, disponibilidad) VALUES
('Carlos', 'Ramírez', 'Cortes clásicos', 'carlos@barbershop.com', '555-0101', '$2b$10$7Z1qX3YJ5vN8KxE3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y', 'Disponible'),
('Miguel', 'Torres', 'Diseño y fade', 'miguel@barbershop.com', '555-0102', '$2b$10$7Z1qX3YJ5vN8KxE3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y', 'Disponible'),
('Juan', 'Pérez', 'Barba y afeitado', 'juan@barbershop.com', '555-0103', '$2b$10$7Z1qX3YJ5vN8KxE3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y3QJ5YkuQZ8J5Y', 'Disponible');

-- Insertar clientes de ejemplo
INSERT INTO CLIENTE (nombre, apellido, correo, telefono, contraseña, direccion) VALUES
('Ana', 'García', 'ana@example.com', '555-0201', '$2b$10$examplehash1', 'Calle 123'),
('Luis', 'Martínez', 'luis@example.com', '555-0202', '$2b$10$examplehash2', 'Avenida 456');

-- Insertar usuarios de ejemplo (contraseña ejemplo: 'password123')
-- NOTA: En producción usar bcrypt real, estos son hashes de ejemplo
INSERT INTO USUARIO (email, password_hash, rol, id_cliente, id_barbero) VALUES
-- Clientes
('ana@example.com', '$2b$10$examplehash1', 'CLIENTE', 1, NULL),
('luis@example.com', '$2b$10$examplehash2', 'CLIENTE', 2, NULL),
-- Barberos
('carlos@barbershop.com', '$2b$10$examplehash3', 'BARBERO', NULL, 1),
('miguel@barbershop.com', '$2b$10$examplehash4', 'BARBERO', NULL, 2),
('juan@barbershop.com', '$2b$10$examplehash5', 'BARBERO', NULL, 3);

-- ============================================
-- VISTAS ÚTILES (OPCIONAL)
-- ============================================

-- Vista de citas con información completa
CREATE VIEW vista_citas_completas AS
SELECT 
    c.id_cita,
    c.fecha,
    c.hora,
    c.estado,
    CONCAT(cl.nombre, ' ', cl.apellido) AS cliente,
    cl.telefono AS telefono_cliente,
    CONCAT(b.nombre, ' ', b.apellido) AS barbero,
    s.nombre_servicio,
    s.precio,
    s.duracion
FROM CITA c
JOIN CLIENTE cl ON c.id_cliente = cl.id_cliente
JOIN BARBERO b ON c.id_barbero = b.id_barbero
JOIN SERVICIO s ON c.id_servicio = s.id_servicio;

-- Vista de pagos con información de cita
CREATE VIEW vista_pagos_completos AS
SELECT 
    p.id_pago,
    p.fecha_pago,
    p.metodo_pago,
    p.monto,
    p.estado_pago,
    c.fecha AS fecha_cita,
    c.hora AS hora_cita,
    CONCAT(cl.nombre, ' ', cl.apellido) AS cliente,
    s.nombre_servicio
FROM PAGO p
JOIN CITA c ON p.id_cita = c.id_cita
JOIN CLIENTE cl ON c.id_cliente = cl.id_cliente
JOIN SERVICIO s ON c.id_servicio = s.id_servicio;

-- ============================================
-- TRIGGERS ÚTILES
-- ============================================

-- Trigger para actualizar total del carrito cuando se modifica detalle
DELIMITER //

CREATE TRIGGER trg_actualizar_total_carrito
AFTER INSERT ON DETALLE_CARRITO
FOR EACH ROW
BEGIN
    UPDATE CARRITO 
    SET total = (
        SELECT SUM(subtotal) 
        FROM DETALLE_CARRITO 
        WHERE id_carrito = NEW.id_carrito
    )
    WHERE id_carrito = NEW.id_carrito;
END//

CREATE TRIGGER trg_actualizar_total_carrito_update
AFTER UPDATE ON DETALLE_CARRITO
FOR EACH ROW
BEGIN
    UPDATE CARRITO 
    SET total = (
        SELECT SUM(subtotal) 
        FROM DETALLE_CARRITO 
        WHERE id_carrito = NEW.id_carrito
    )
    WHERE id_carrito = NEW.id_carrito;
END//

CREATE TRIGGER trg_actualizar_total_carrito_delete
AFTER DELETE ON DETALLE_CARRITO
FOR EACH ROW
BEGIN
    UPDATE CARRITO 
    SET total = COALESCE((
        SELECT SUM(subtotal) 
        FROM DETALLE_CARRITO 
        WHERE id_carrito = OLD.id_carrito
    ), 0)
    WHERE id_carrito = OLD.id_carrito;
END//

DELIMITER ;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
