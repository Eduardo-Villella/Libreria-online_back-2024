const express = require('express');
const { Router } = require('express');
const jwt = require('jsonwebtoken');

const { generateToken, verifyToken, checkRol, isAdmin, verifyCredentials, upload } = require('../middleware/index');
const { UsersController } = require('../controllers/index');
const { Login } = require('../controllers/index');

const router = Router();
const usersController = new UsersController();
const login = new Login();


// Middleware para logging de datos recibidos
const logRequestInfo = (req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Método:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Antes de Multer: No se puede leer req.body ni req.file');
    next(); // Llama al siguiente middleware
};


/* --------------------- Rutas generales ----------------------------- */
router.post('/register', usersController.createUser.bind(usersController));// Registro de usuario
router.post('/login', login.login.bind(login));// Inicio de sesion usuario
router.post('/updatePass', (req, res, next) => { usersController.updatePassword(req, res); });// Atualiza password

router.get('/perfil', verifyToken, usersController.getById.bind(usersController));// Verifica token y busca el usuario por id y trae todo el usuario
router.get('/isEmail/:email', (req, res, next) => { // Verifica si el email existe y solo devuelve statusCode
    try {
        const originalJson = res.json.bind(res);// Interceptamos el metodo res.json para capturar la respuesta del controlador
        res.json = (data) => {
            res.sendStatus(res.statusCode);// Solo enviamos el status sin el cuerpo de la respuesta
        };

        usersController.findByEmail(req, res);// Llamamos al controlador

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.sendStatus(500);
        }
    }
});

router.put('/admin/general/:id', verifyToken, (req, res, next) => { usersController.softDeleteUser(req, res); });// Borrado logico de usuario (actualizacion de datos put)

/* --------------------- Rutas Clientes ----------------------------- */

router.put('/customer/update', verifyToken, upload, (req, res, next) => { usersController.updateUser(req, res); });// Actualizacion de datos del usuario unicamente propios Perfil
router.put('/customer/:id', verifyToken, (req, res, next) => { usersController.softDeleteUser(req, res); });// Borrado logico de usuario (actualizacion de datos put)

/* --------------------- Rutas Administradores ----------------------------- */

router.get('/admin', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.getAll(req, res); });// Obtener todos los usuarios
router.get('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.getById(req, res); });// Obtener un usuario por ID
router.get('/admin/:email', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.findByEmail(req, res); });// Obtener un usuario por email
router.post('/admin/search', verifyToken, checkRol('Administrador'), (req, res) => { usersController.criteria(req, res); });// Busqueda de criterios multiples recomendable post en lugar de get
router.post('/admin/validate', verifyCredentials, (req, res) => {console.log('Respuesta enviada desde la ruta /admin/validate tipo de respuesta: return res.status(200).json({message: Usuario autenticado como Administrador.}) '); return res.status(200).json({message: 'Usuario autenticado como Administrador.'}); });// Si las credenciales son validas, el usuario es administrador, se puede proceder

router.post('/admin', verifyToken, checkRol('Administrador'), logRequestInfo, upload, (req, res, next) => {// Crea nuevo usuario desde admin
    // Verificacion del archivo opcional
    if (!req.file) {
        console.log('POST No se recibió ningún archivo, pero se procede con la actualización de datos.');
    } else {
        console.log('POST Archivo recibido:', req.file);
        console.log('en routes POST 2 Archivo recibido (después de Multer):', req.file, req.file.originalFileName,  typeof(req.file)); // Muestra la informacion del archivo subido
        console.log('en routes POST 2 Datos del formulario (después de Multer):', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); // Muestra los otros campos del formulario
        console.log('en routes POST 3 Datos recibidos en la solicitud:', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); 
        console.log('en routes POST 3 Archivo recibido (antes de Multer):', req.file, typeof(req.file)); 
        console.log('POST 3 2 Nombre original del archivo:', req.body.originalFileName, typeof(req.body.originalFileName));
    }
    // Logs para verificar lo que se recibe
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    };
    
    console.log('POST 3 1 Tipo:', req.body), typeof(req.body.type);
    console.log('POST 3 3 ID:', req.body.id, typeof(req.body.id));
    
    usersController.createUser(req, res);// Llama al controlador para manejar la logica de creacion
});

router.put('/admin/:id', verifyToken, checkRol('Administrador'), logRequestInfo, upload, (req, res, next) => {// Actualizar usuarios desde admin
    // Verificacion del archivo opcional
    if (!req.file) {
        console.log('No se recibió ningún archivo, pero se procede con la actualización de datos.');
    } else {
        console.log('Archivo recibido:', req.file);
        console.log('en routes 2 Archivo recibido (después de Multer):', req.file, req.file.originalFileName,  typeof(req.file)); // Muestra la informacion del archivo subido
        console.log('en routes 2 Datos del formulario (después de Multer):', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); // Muestra los otros campos del formulario
        console.log('en routes 3 Datos recibidos en la solicitud:', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); 
        console.log('en routes 3 Archivo recibido (antes de Multer):', req.file, typeof(req.file)); 
        console.log('3 2 Nombre original del archivo:', req.body.originalFileName, typeof(req.body.originalFileName));
    }
    // Logs para verificar lo que se recibe
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    };
    
    console.log('3 1 Tipo:', req.body), typeof(req.body.type);
    console.log('3 3 ID:', req.body.id, typeof(req.body.id));
    
    usersController.updateUser(req, res);// Llama al controlador para manejar la logica de actualizacion
});

router.delete('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.deleteUser(req, res); });// Elimina totalmente un usuario


module.exports = router;

