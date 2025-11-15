const express = require('express');
const router = express.Router();

// Importar controladores
const clienteController = require('../controllers/clienteController');
const barberoController = require('../controllers/barberoController');
const usuarioController = require('../controllers/usuarioController');
const servicioController = require('../controllers/servicioController');
const citaController = require('../controllers/citaController');
const carritoController = require('../controllers/carritoController');
const detalleCarritoController = require('../controllers/detalleCarritoController');
const pagoController = require('../controllers/pagoController');

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
router.post('/citas', citaController.createCita);
router.get('/citas', citaController.getAllCitas);
router.get('/citas/:id', citaController.getCitaById);
router.put('/citas/:id', citaController.updateCita);
router.delete('/citas/:id', citaController.deleteCita);

// ============================================
// RUTAS DE CARRITOS
// ============================================
router.post('/carritos', carritoController.createCarrito);
router.get('/carritos', carritoController.getAllCarritos);
router.get('/carritos/:id', carritoController.getCarritoById);
router.put('/carritos/:id', carritoController.updateCarrito);
router.delete('/carritos/:id', carritoController.deleteCarrito);

// ============================================
// RUTAS DE DETALLES DE CARRITO
// ============================================
router.post('/detalles-carrito', detalleCarritoController.createDetalleCarrito);
router.get('/detalles-carrito', detalleCarritoController.getAllDetallesCarrito);
router.put('/detalles-carrito/:id', detalleCarritoController.updateDetalleCarrito);
router.delete('/detalles-carrito/:id', detalleCarritoController.deleteDetalleCarrito);

// ============================================
// RUTAS DE PAGOS
// ============================================
router.post('/pagos', pagoController.createPago);
router.get('/pagos', pagoController.getAllPagos);
router.get('/pagos/:id', pagoController.getPagoById);
router.put('/pagos/:id', pagoController.updatePago);
router.delete('/pagos/:id', pagoController.deletePago);

module.exports = router;
