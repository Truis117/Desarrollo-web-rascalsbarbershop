const usuarioController = require('./usuarioController');
const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const inMemoryAuth = require('../utils/inMemoryAuth');

// Render login form
exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle login form
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email, activo: true } });
        if (!usuario) return res.render('login', { error: 'Credenciales inválidas' });

        const match = await bcrypt.compare(password, usuario.password_hash);
        if (!match) return res.render('login', { error: 'Credenciales inválidas' });

        // update ultimo_login
        await usuario.update({ ultimo_login: new Date() });

        // store minimal user in session
        req.session.user = {
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            rol: usuario.rol
        };

        return res.redirect('/');
    } catch (err) {
        console.error('Login error:', err);
        return res.render('login', { error: 'Error interno' });
    }
};

// Render register form
exports.showRegister = (req, res) => {
    res.render('register', { error: null });
};

// Handle register form (creates a CLIENTE with minimal fields)
exports.postRegister = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        // Basic validation
        if (!nombre || !email || !password) return res.render('register', { error: 'Todos los campos son obligatorios' });

        // Check existing
        let existing;
        try {
            existing = await Usuario.findOne({ where: { email } });
        } catch (err) {
            // DB not available -> use in-memory store
            if (err.parent && err.parent.code === 'ECONNREFUSED') {
                existing = inMemoryAuth.findByEmail(email);
            } else throw err;
        }
        if (existing) return res.render('register', { error: 'El email ya está registrado' });

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create minimal Cliente and Usuario via usuarioController logic path
        // We'll emulate POST body expected by usuarioController.register
        const fakeReq = { body: { email, password: hash, rol: 'CLIENTE', nombre, apellido: '', telefono: null, direccion: null } };
        // usuarioController.register expects raw password for some fields; it currently stores password as-is.
        // To keep consistent we will create Cliente and Usuario directly here using models.
        let newUsuario;
        try {
            const Cliente = require('../models').Cliente;
            const newCliente = await Cliente.create({ nombre, apellido: '', correo: email, telefono: null, contraseña: hash, direccion: null });
            newUsuario = await Usuario.create({ email, password_hash: hash, rol: 'CLIENTE', id_cliente: newCliente.id_cliente, id_barbero: null });
        } catch (err) {
            if (err.parent && err.parent.code === 'ECONNREFUSED') {
                // fallback to in-memory
                newUsuario = await inMemoryAuth.createUser({ nombre, email, password_hash: hash });
            } else throw err;
        }

        // set session
        req.session.user = { id_usuario: newUsuario.id_usuario, email: newUsuario.email, rol: newUsuario.rol };

        return res.redirect('/');
    } catch (err) {
        console.error('Register error:', err);
        return res.render('register', { error: 'Error interno' });
    }
};

// Logout
exports.postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
