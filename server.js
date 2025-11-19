require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3500;
const session = require('express-session');

// Importar configuración de base de datos y rutas API
const { testConnection } = require('./config/database');
const apiRoutes = require('./routes/api');
const authWebRoutes = require('./routes/authWeb');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sesiones (usar store persistente en producción)
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Exponer sesión a las vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Rutas de autenticación web montadas en raíz (/login, /register)
app.use('/', authWebRoutes);

// ============================================
// RUTAS DE VISTAS (Páginas Web)
// ============================================
app.get('/', (req, res) => res.render('index'));
app.get('/services', (req, res) => res.render('services'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/booking', (req, res) => res.render('booking'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/admin', (req, res) => res.render('panel'));
// ============================================
// RUTAS DE API REST
// ============================================
app.use('/api', apiRoutes);

// ============================================
// MANEJO DE ERRORES 404
// ============================================
app.use((req, res) => {
    const accept = req.headers.accept || '';
    if (accept.includes('text/html')) return res.status(404).render('404');
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const startServer = async () => {
    try {
        // Probar conexión a base de datos
        await testConnection();

        // Iniciar servidor
        app.listen(port, () => {
            console.log(`✓ Servidor Express corriendo en puerto ${port}`);
            console.log(`✓ Vistas disponibles en http://localhost:${port}`);
            console.log(`✓ API REST disponible en http://localhost:${port}/api`);

            // Debug: listar rutas registradas
            try {
                const routes = [];
                app._router.stack.forEach((middleware) => {
                    if (middleware.route) {
                        // routes registered directly on the app
                        routes.push(middleware.route.path);
                    } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
                        // router middleware
                        middleware.handle.stack.forEach((handler) => {
                            if (handler.route) routes.push(handler.route.path);
                        });
                    }
                });
                console.log('Registered routes:', routes);
            } catch (e) {
                console.log('Could not list routes:', e.message);
            }
        });
    } catch (error) {
        console.error('✗ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();