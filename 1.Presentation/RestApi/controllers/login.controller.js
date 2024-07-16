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
                return res.status(400).json({ message: 'en controller: Email no proporcionado' });
            }
            if (!password) {
                return res.status(400).json({ message: 'en controller: Contraseña no proporcionada' });
            }

            // Validacion del email y contraseña utilizando Joi en validator.js
            try {
                validator.validateUser({ email, password });
            } catch (error) {
                return res.status(400).json({ success: false, message:'en controller: Email o password no cumplen requisitos', error: error.message });
            }

            // Verificacion del SuperAdmin
            if (email === 'el.administrador@soy.yo' && password === 'LosAccidentesN0existen') {
                const token = generateToken({
                    email: email,
                    role: 'SuperAdmin'
                });
                return res.json({ success: true, message: 'en controller: Inicio de sesión como SuperAdmin exitoso', token });
            }

            // Verificacion del Email en la Base de Datos
            const isRegistered = await this.model.findByEmail(email);
            if (!isRegistered) {
                return res.status(404).json({ message: 'en controller: Email no registrado' });
            }

            // Verificacion de Credenciales
            const validCredentials = await this.model.verifyCredentials(email);
            if (!validCredentials) {
                return res.status(401).json({ success: false, message: 'en controller: Credenciales incorrectas' });
            }

            // Generacion de Token
            const token = generateToken({
                id: user.id_usuarios,
                usuario: user.usuario,
                email: user.email,
                role: user.rol
            });

            res.json({ success: true, message: 'en controller: Inicio de sesión exitoso', token });

        } catch (error) {
            res.status(500).json({ success: false, message: 'en controller: Error al iniciar sesión', error: error.message });
        }
    }

}


module.exports = Login;

