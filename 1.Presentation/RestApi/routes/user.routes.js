const express = require('express');
const { Router } = require('express');
const jwt = require('jsonwebtoken'); 

const { generateToken, verifyToken, checkRol } = require('../middleware/index');
const { UsersController } = require('../controllers/index');
const { Login } = require('../controllers/index');

const router = Router();
const usersController = new UsersController();
const login = new Login();


/* --------------------- Rutas generales ----------------------------- */
router.post('/register', usersController.createUser.bind(usersController));// Registro de usuario
router.post('/login', login.login.bind(login));// Inicio de sesion usuario
router.get('/perfil', verifyToken, usersController.getById.bind(usersController));// Verifica token y busca el usuario por id y tare todo el usuario

/* --------------------- Rutas Clientes ----------------------------- */

router.put('/customer/update', verifyToken,(req, res, next) => { usersController.updateUser(req, res); });// Actualizacion de datos del usuario unicamente propios
router.put('/customer/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.softDeleteUser(req, res); });// Borrado logico de usuario (actualizacion de datos put)

/* --------------------- Rutas Administradores ----------------------------- */

router.get('/admin', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.getAll(req, res); });// Obtener todos los usuarios
router.get('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.getById(req, res); });// Obtener un usuario por ID
router.get('/admin/:email', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.findByEmail(req, res); });// Obtener un usuario por email
router.post('/admin/search', verifyToken, checkRol('Administrador'), (req, res) => { usersController.criteria(req, res); });// Busqueda de criterios multiples recomendable post en lugar de get

router.post('/admin', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.createUser(req, res); });// Crear nuevo usuario

router.put('/admin', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.updateUser(req, res); });// Actualizacion de datos propios y de clientes

router.put('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.softDeleteUser(req, res); });// Borrado logico de usuario (actualizacion de datos put)
router.delete('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.deleteUser(req, res); });// Elimina totalmente un usuario


module.exports = router;

