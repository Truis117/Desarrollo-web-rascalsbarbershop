const { Usuario, Cliente, Barbero } = require('../models');

// Registro de Usuario
exports.register = async (req, res) => {
    try {
        const { email, password, rol, nombre, apellido, telefono, especialidad, direccion } = req.body;

        // Validar que el email no exista
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }

        let nuevoUsuario;

        if (rol === 'CLIENTE') {
            // Crear Cliente primero
            const nuevoCliente = await Cliente.create({
                nombre,
                apellido,
                correo: email,
                telefono,
                contraseña: password, // En producción, hashear con bcrypt
                direccion
            });

            // Crear Usuario vinculado al Cliente
            nuevoUsuario = await Usuario.create({
                email,
                password_hash: password, // En producción, hashear con bcrypt
                rol: 'CLIENTE',
                id_cliente: nuevoCliente.id_cliente,
                id_barbero: null
            });

        } else if (rol === 'BARBERO') {
            // Crear Barbero primero
            const nuevoBarbero = await Barbero.create({
                nombre,
                apellido,
                correo: email,
                telefono,
                especialidad
            });

            // Crear Usuario vinculado al Barbero
            nuevoUsuario = await Usuario.create({
                email,
                password_hash: password, // En producción, hashear con bcrypt
                rol: 'BARBERO',
                id_cliente: null,
                id_barbero: nuevoBarbero.id_barbero
            });

        } else {
            return res.status(400).json({ error: 'Rol no válido. Debe ser CLIENTE o BARBERO.' });
        }

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario.', details: error.message });
    }
};

// Login de Usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({
            where: { email, activo: true },
            include: [
                { model: Cliente, as: 'Cliente' },
                { model: Barbero, as: 'Barbero' }
            ]
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Verificar contraseña (En producción, usar bcrypt.compare)
        if (usuario.password_hash !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Actualizar último login
        await usuario.update({ ultimo_login: new Date() });

        // Preparar datos de respuesta según el rol
        let datosUsuario = {
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            rol: usuario.rol,
            ultimo_login: usuario.ultimo_login
        };

        if (usuario.rol === 'CLIENTE' && usuario.Cliente) {
            datosUsuario.cliente = {
                id_cliente: usuario.Cliente.id_cliente,
                nombre: usuario.Cliente.nombre,
                apellido: usuario.Cliente.apellido,
                telefono: usuario.Cliente.telefono
            };
        } else if (usuario.rol === 'BARBERO' && usuario.Barbero) {
            datosUsuario.barbero = {
                id_barbero: usuario.Barbero.id_barbero,
                nombre: usuario.Barbero.nombre,
                apellido: usuario.Barbero.apellido,
                especialidad: usuario.Barbero.especialidad
            };
        }

        res.status(200).json({
            message: 'Login exitoso.',
            usuario: datosUsuario
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión.', details: error.message });
    }
};

// Obtener perfil de usuario actual
exports.getProfile = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [
                { model: Cliente, as: 'Cliente' },
                { model: Barbero, as: 'Barbero' }
            ]
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el perfil.', details: error.message });
    }
};

// Obtener todos los usuarios (solo para administración)
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [
                { model: Cliente, as: 'Cliente' },
                { model: Barbero, as: 'Barbero' }
            ]
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios.', details: error.message });
    }
};

// Desactivar usuario
exports.deactivateUser = async (req, res) => {
    try {
        const [updatedRows] = await Usuario.update(
            { activo: false },
            { where: { id_usuario: req.params.id } }
        );

        if (updatedRows) {
            res.status(200).json({ message: 'Usuario desactivado exitosamente.' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar el usuario.', details: error.message });
    }
};
