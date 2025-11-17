// Simple in-memory auth store for development/testing when DB is unavailable
const bcrypt = require('bcryptjs');

const users = [];
let nextId = 1;

function findByEmail(email) {
    return users.find(u => u.email === email) || null;
}

async function createUser({ nombre, email, password_hash, rol = 'CLIENTE' }) {
    const user = {
        id_usuario: nextId++,
        nombre: nombre || '',
        email,
        password_hash,
        rol,
        fecha_creacion: new Date(),
        ultimo_login: null,
        activo: true
    };
    users.push(user);
    return user;
}

async function verifyPassword(user, plain) {
    return bcrypt.compare(plain, user.password_hash);
}

async function updateLastLogin(user) {
    user.ultimo_login = new Date();
    return user;
}

module.exports = {
    findByEmail,
    createUser,
    verifyPassword,
    updateLastLogin,
    // for testing
    _dump: () => ({ users: [...users] })
};
