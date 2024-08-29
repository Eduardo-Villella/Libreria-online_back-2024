const { request, response } = require('express');

const  { verifyToken } = require('./auth.JwToken');
const { UsersController } = require('../controllers/index');

const usersController = new UsersController();


async function verifyCredentials(req = request, res = response, next) {
    try {
        // Primero, verifica el token usando la funcion middleware verifyToken
        await verifyToken(req, res, async () => {
            const email = req.user.email;// Si el token es valido, obtiene el email del token decodificado
            console.log('en middleware verifyCredentials.js, try verifyToken, email y tipo: ', email, typeof(email));//borrar
            const { password } = req.body; // Extrae la contraseña del cuerpo de la solicitud
            console.log('en verifyCredentials middleware email y password y tipos: ', email, typeof(email), password, typeof(password));//borrar

        // Luego, verifica email obtenido del token y password enviado en body peticion    
            const userResponse = await usersController.verifyCredentials({ body: { email, password } }, res);// Llama a la funcion del controlador para verificar credenciales
            console.log('en middleware verifyCredentials, user body email y password');//borrar

            if (!userResponse.success) {
                console.log('en middleware verifyCredentials UNO en if !userResponse.success tipo de respuesta: return res.status(204)');//borrar
                return res.status(204);//.json({ message: 'en verifyCredentials en if !user: Email no encontrado o contraseña incorrecta' });
            }

            req.user = userResponse; // Guarda el usuario en req para usarlo en los siguientes middleware o controladores
            console.log('en middleware verifyCredentials DOS en return next, Usuario autenticado, pasando al siguiente middleware tipo de respuesta : return next()');// boprrar
            if (!res.headersSent) {// Pasa al siguiente middleware
                return next();
            }
        });

    } catch (error) {
        console.log('en middleware verifyCredentials TRES Error en middleware:, catch, tipo de respuesta: return next(error)');//borrar
        if (!res.headersSent) {// Pasa el error al manejador de errores
            return next();
        }
    }
    
}


module.exports = verifyCredentials;

