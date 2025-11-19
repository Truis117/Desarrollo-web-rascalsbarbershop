const express = require('express');
const router = express.Router();

// Importar controladores
const clienteController = require('../controllers/clienteController');
const barberoController = require('../controllers/barberoController');
const usuarioController = require('../controllers/usuarioController');
const servicioController = require('../controllers/servicioController');
const citaController = require('../controllers/citaController');
const pagoController = require('../controllers/pagoController');
const panelController = require('../controllers/panelController');

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================
router.post('/auth/register', usuarioController.register);
router.post('/auth/login', usuarioController.login);
router.get('/auth/profile/:id', usuarioController.getProfile);
router.get('/auth/usuarios', usuarioController.getAllUsuarios);
router.patch('/auth/usuarios/:id/deactivate', usuarioController.deactivateUser);

// ============================================
// RUTAS DE CLIENTES
// ============================================
router.post('/clientes', clienteController.createCliente);
router.get('/clientes', clienteController.getAllClientes);
router.get('/clientes/:id', clienteController.getClienteById);
router.put('/clientes/:id', clienteController.updateCliente);
router.delete('/clientes/:id', clienteController.deleteCliente);

// ============================================
// RUTAS DE BARBEROS
// ============================================
router.post('/barberos', barberoController.createBarbero);
router.get('/barberos', barberoController.getAllBarberos);
router.get('/barberos/:id', barberoController.getBarberoById);
router.put('/barberos/:id', barberoController.updateBarbero);
router.delete('/barberos/:id', barberoController.deleteBarbero);

// ============================================
// RUTAS DE SERVICIOS
// ============================================
router.post('/servicios', servicioController.createServicio);
router.get('/servicios', servicioController.getAllServicios);
router.get('/servicios/:id', servicioController.getServicioById);
router.put('/servicios/:id', servicioController.updateServicio);
router.delete('/servicios/:id', servicioController.deleteServicio);

// ============================================
// RUTAS DE CITAS
// ============================================
// Ruta de prueba
router.get('/citas/test', (req, res) => {
    res.json({ message: 'API de citas funcionando correctamente' });
});

router.post('/citas/booking', citaController.createBooking); // Endpoint especial para formulario web
router.post('/citas', citaController.createCita);
router.get('/citas', citaController.getAllCitas);
router.get('/citas/:id', citaController.getCitaById);
router.put('/citas/:id', citaController.updateCita);
router.delete('/citas/:id', citaController.deleteCita);

// ============================================
// RUTAS DE PAGOS
// ============================================
router.post('/pagos', pagoController.createPago);
router.get('/pagos', pagoController.getAllPagos);
router.get('/pagos/:id', pagoController.getPagoById);
router.put('/pagos/:id', pagoController.updatePago);
router.delete('/pagos/:id', pagoController.deletePago);

// ============================================
// RUTAS DEL PANEL DE ADMINISTRACIÓN
// ============================================
router.get('/panel/statistics', panelController.getStatistics);
router.get('/panel/citas', panelController.getAllCitas);
router.get('/panel/citas/filter', panelController.getCitasByDate);
router.patch('/panel/citas/:id/status', panelController.updateCitaStatus);

module.exports = router;
