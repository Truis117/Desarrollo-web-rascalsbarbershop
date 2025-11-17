require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Importar configuración de base de datos y rutas API
const { testConnection } = require('./config/database');
const apiRoutes = require('./routes/api');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// RUTAS DE VISTAS (Páginas Web)
// ============================================
app.get('/', (req, res) => res.render('index'));
app.get('/services', (req, res) => res.render('services'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/booking', (req, res) => res.render('booking'));
app.get('/contact', (req, res) => res.render('contact'));

// ============================================
// RUTAS DE API REST
// ============================================
app.use('/api', apiRoutes);

// ============================================
// MANEJO DE ERRORES 404
// ============================================
app.use((req, res) => {
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
        });
    } catch (error) {
        console.error('✗ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();