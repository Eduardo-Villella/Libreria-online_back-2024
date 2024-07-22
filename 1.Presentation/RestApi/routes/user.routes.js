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

router.put('/customer/update', verifyToken,(req, res, next) => { usersController.updateUser(req, res); })// Actualizacion de datos del usuario unicamente propios

//router.get('/:id', usersController.getById.bind(usersController));
//router.get('/',usersController.getAll.bind(usersController));// Trae todos los usuarios
//router.delete('/:id', usersController.deleteUser.bind(usersController));

/* --------------------- Rutas Administradores ----------------------------- */

router.put('/admin/update', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.updateUser(req, res); })// Actualizacion de datos propios y de clientes

//router.get('/admi', verifyToken, usersController.getAll.bind(usersController));// Obtener todos los usuarios
//router.get('/admi/:id', verifyToken, usersController.getById.bind(usersController));// Obtener un usuario por ID
//router.get('/admi/email/:email', verifyToken, usersController.isEmailRegistered.bind(usersController));// Verificar si un email está registrado // Manejar de otra forma
//router.post('/admi/verifyCredentials', verifyToken, usersController.verifyCredentials.bind(usersController));// Verificar credenciales de un usuario // Manejar de otra forma
//router.delete('/admi/:id', verifyToken, usersController.deleteUser.bind(usersController));// Eliminar un usuario por ID


module.exports = router;

