const express = require('express');
const { Router } = require('express');
const jwt = require('jsonwebtoken');

const { generateToken, verifyToken, checkRol, isAdmin, verifyCredentials, upload } = require('../middleware/index');
const { UsersController } = require('../controllers/index');
const { Login } = require('../controllers/index');

const router = Router();
const usersController = new UsersController();
const login = new Login();


/* --------------------- Rutas generales ----------------------------- */
router.post('/register', usersController.createUser.bind(usersController));// Registro de usuario
router.post('/login', login.login.bind(login));// Inicio de sesion usuario
router.post('/updatePass', (req, res, next) => { usersController.updatePassword(req, res); });// Atualiza password

router.get('/perfil', verifyToken, usersController.getById.bind(usersController));// Verifica token y busca el usuario por id y trae todo el usuario
router.get('/isEmail/:email', (req, res, next) => { 
    try {
        const originalJson = res.json.bind(res);// Interceptamos el método res.json para capturar la respuesta del controlador
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
});// Verifica si el email existe y solo devuelve statusCode

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

router.post('/admin', verifyToken, checkRol('Administrador'), upload, (req, res, next) => { usersController.createUser(req, res); });// Crear nuevo usuario

//router.put('/admin/:id', verifyToken, checkRol('Administrador'), uploadMulter, (req, res, next) => { usersController.updateUser(req, res); });// Actualizacion de datos propios y de clientes

// Middleware para logging de datos recibidos
const logRequestData = (req, res, next) => {
    console.log('en routes 1 Datos recibidos en la solicitud:', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); 
    console.log('en routes 1 Archivo recibido (antes de Multer):', req.file, typeof(req.file)); 
    console.log('1 Tipo:', req.body.type);
    console.log('2 Nombre original del archivo:', req.body.originalFileName);
    console.log('3 ID:', req.body.id);
    next(); // Llama al siguiente middleware
};

router.put('/admin/:id', verifyToken, checkRol('Administrador'), logRequestData, upload, (req, res, next) => { 
    // Logs para verificar lo que se recibe
    if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
    };
    console.log('en routes 2 Archivo recibido (después de Multer):', req.file, req.file.originalFileName,  typeof(req.file)); // Muestra la información del archivo subido
    console.log('en routes 2 Datos del formulario (después de Multer):', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); // Muestra los otros campos del formulario
    console.log('en routes 3 Datos recibidos en la solicitud:', req.body, req.body.type, req.body.originalFileName, req.body.id, typeof(req.body)); 
    console.log('en routes 3 Archivo recibido (antes de Multer):', req.file, typeof(req.file)); 
    console.log('3 1 Tipo:', req.body.type), typeof(req.body.type);
    console.log('3 2 Nombre original del archivo:', req.body.originalFileName, typeof(req.body.originalFileName));
    console.log('3 3 ID:', req.body.id, typeof(req.body.id));
    // Llama al controlador para manejar la lógica de actualización
    usersController.updateUser(req, res);
});

router.delete('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => { usersController.deleteUser(req, res); });// Elimina totalmente un usuario


module.exports = router;


/*router.put('/admin/:id', verifyToken, checkRol('Administrador'), (req, res, next) => {
    // Imprimir información recibida en la ruta
    console.log('Datos recibidos en la ruta de actualización:', {
        userId: req.params.id, // ID del usuario que se está actualizando
        body: req.body, // Cuerpo de la solicitud con los datos a actualizar
        headers: req.headers, // Cabeceras de la solicitud
        token: req.headers['authorization'] // Token de autorización
    });

    // Verificar si el rol es 'Administrador'
    const rol = req.user ? req.user.rol : null; // Asegúrate de que req.user tenga el rol
    console.log('Rol recibido en la ruta:', rol);

    usersController.updateUser(req, res);
});*/