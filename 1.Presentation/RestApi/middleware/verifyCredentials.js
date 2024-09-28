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
            console.log('en middleware verifyCredentials.js email y password y tipos: ', email, typeof(email), password, typeof(password));//borrar

        // Luego, verifica email obtenido del token y password enviado en body peticion, con base de datos   
            const userResponse = await usersController.verifyCredentials({ body: { email, password } }, res);// Llama a la funcion del controlador para verificar credenciales
            console.log('en middleware verifyCredentials.js, user body email y password OK: ', typeof(userResponse), userResponse.success);//borrar

            if (!userResponse.success) {
                console.log('en middleware verifyCredentials UNO en if (!userResponse.success) tipo de respuesta: return res.status(204) esto es ERROR');//borrar
                return res.status(204);//.json({ message: 'en verifyCredentials.js en if (!userResponse.success): Email no encontrado o contraseña incorrecta' });
            }

            req.user = userResponse.user; // Guarda el usuario en req para usarlo en los siguientes middleware o controladores
            console.log('en middleware verifyCredentials.js DOS en return next, Usuario autenticado, pasando al siguiente middleware tipo de respuesta : return next()', userResponse.success);// borrar
            if (!res.headersSent) {
                return next();// Pasa al siguiente middleware si la respuesta es correcta, sin necesidad de requerir cabeceras
            }
        });

    } catch (error) {
        console.log('en middleware verifyCredentials TRES Error en middleware:, catch, tipo de respuesta: return next(error)', error);//borrar
        if (!res.headersSent) {
            return next(error);// Pasa el error al manejador de errores, sin necesidad de pedir cabeceras
        }
    }
    
}


module.exports = verifyCredentials;

