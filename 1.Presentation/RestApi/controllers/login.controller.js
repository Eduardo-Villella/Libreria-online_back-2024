const { request, response } = require('express');

const { UserModel } = require('../../../2.Domain/Models/index');
const validator = require('../../helpers/Utils/validator');
const { generateToken, verifyToken }  = require('../middleware/auth.JwToken');


class Login {
    constructor() {
        this.model = new UserModel();
    }

    async login(req = request, res = response) {
        try {
        const { email, password } = req.body;

            // Validacion de entrada
            if (!email) {
                return res.status(400).json({ message: 'en login controller: Email no proporcionado' });
            }
            if (!password) {
                return res.status(400).json({ message: 'en login controller: Contraseña no proporcionada' });
            }

            // Validacion del email y contraseña utilizando Joi en validator.js
            try {
                validator.validateUser({ email, password });
            } catch (error) {
                return res.status(400).json({ success: false, message:'en login controller: Email o password no cumplen requisitos', error: error.message });
            }

            // Verificacion del SuperAdmin
            if (email === 'el.administrador@soy.yo' && password === 'LosAccidentesN0existen') {
                const token = generateToken({
                    email: email,
                    rol: 'Administrador'
                });
                return res.json({ success: true, message: 'en login controller: Inicio de sesión como SuperAdmin exitoso', token, isAdmin: true });
            }

            // Verificacion del Email en la Base de Datos
            const user = await this.model.verifyCredentials(email, password);
            if (user === null) {
                return res.json({ success: false, error_code: 101, message: 'en login controller: Email no registrado' });
            }
            if (user === false) {
                return res.json({ success: false, error_code: 102, message: 'en login controller: Contraseña incorrecta' });
            }

            // Generacion de Token
            const token = generateToken({
                id: user.id_usuarios,
                usuario: user.usuario,
                email: user.email,
                rol: user.rol
            });

            res.json({ success: true, message: 'en login controller: Inicio de sesión exitoso', token });

        } catch (error) {
            res.status(500).json({ success: false, message: 'en login controller: Error al iniciar sesión', error: error.message });
        }
    }

}


module.exports = Login;

