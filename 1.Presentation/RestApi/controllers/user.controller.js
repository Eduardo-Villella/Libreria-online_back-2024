const { request, response } = require('express');
const bcrypt = require('bcrypt');

const { UserModel } = require('../../../2.Domain/Models/index');
const validator = require('../../helpers/Utils/validator');
const { generateToken, verifyToken }  = require('../middleware/auth.JwToken');

class UsersController {
    constructor() {
        this.model = new UserModel();
    }

    // Query functions //

    async getAll(req = request, res = response) {
        try {
            const result = await this.model.getAll();
            res.json({ result });

        } catch (error) {
            res.status(500).json({success: false, message: 'en controller, getAll: No se encontraron usuarios', error: error.message});
        }
    }

    /* -------------------- */

    async getById(req = request, res = response) {
        try {
            const id = req.params.id;
            if (!id || isNaN(id)) {// Valida que el ID es un numero
                return res.status(400).json({ message: 'en controller getById: ID de usuario no válido', error: error.message });
            }
            const result = await this.model.getById(id);
            if (!result) {
                return res.status(404).json({ message: 'en controller getById: Usuario no encontrado', error: error.message });
            }
            res.json({ result });

        } catch (error) {
            if (!res.headersSent) { // Verifica si los encabezados ya fueron enviados
                res.status(500).json({mensage: 'en controller getById: No se enviaron los cabezales:', error: error.message });
            } else {
                res.status(500).json({mensage: 'en controller getById: Error después de enviar la respuesta:', error: error.message});
            }
        }
    }

    /* -------------------- */

    async findByEmail(req = request, res = response) {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({ message: 'en controller findByEmail: Email no proporcionado' });
            }
            const result = await this.model.findByEmail(email);
            if (!result) {
                return res.status(404).json({ message: 'en controller findByEmail: Usuario no encontrado' });
            }
            res.json({ result });

        } catch (error) {
            res.status(500).json({ message: 'en controller findByEmail: Error al buscar usuario por email', error: error.message });
        }
    }

    /* -------------------- */

    async criteria(req = request, res = response) {
        try {
            const criteria = req.body; // Esperamos que el frontend envie los criterios en el cuerpo de la solicitud
            const result = await this.model.criteria(criteria);

            if (!result || result.length === 0) {
                return res.status(404).json({ success: false, message: 'en controller, criteria: No se encontraron registros que coincidan con los criterios' });
            }

            res.status(200).json({ success: true, data: result });

        } catch (error) {
            console.error('en controller, criteria: Error al buscar con criterios:', error);
            res.status(500).json({ success: false, message: 'en controller, criteria: Error en la busquedao en los criterios de busqueda' });
        }
    }

    /* -------------------- *//* -------------------- *//* -------------------- *//* -------------------- */

    // Commands functions //
    // El metodo LOGIN de usuarios (Administrador y Cliente) se encuentra en el archivo login.controller.js

    /* -------------------- */

    async createUser(req = request, res = response) {
        try {
            const { usuario, email, password } = req.body;// Extraigo solo los campos necesarios del body
                if (!usuario || !email || !password) {// Valido que los campos requeridos esten
                    return res.status(400).json({ error: 'en controller, create: Debe proporcionar nombre de usuario, email y contraseña' });
                }    

               console.log('en controller, create: Datos recibidos:', { usuario, email, password });// borrar

                try {// Validamos los datos
                    validator.validateUser({ usuario, email, password });

                } catch (error) {
                    return res.status(400).json({ success: false, message:'en controller, create: Email, usuario o password no cumplen requisitos', error: error.message });
                }

                console.log('en controller, create: Datos validados correctamente');// borrar

                const isRegistered = await this.model.findByEmail(email);// Verificacion del Email en la Base de Datos
                    if (isRegistered) {
                        return res.json({ success: false, message: 'en controller, create: Email ya registrado' });
                    }

                    const userEntity = {// Creamos un objeto con estos datos
                        usuario,
                        email,
                        password
                    };

                    const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña
                    console.log('en controller, create: Contraseña hasheada:', hashedPassword);// borrar

                    userEntity.password = hashedPassword;// Actualiza la entidad del usuario (userEntity) con la contraseña hasheada
                    console.log('en controller, create: Contenido de userEntity después de hashear la contraseña:', userEntity);// borrar

                    const result = await this.model.create(userEntity);// Agregamos el usuario utilizando el modelo
                    console.log('en controller, create: Resultado de la creación:', result); //borrar
                    if (!result || !result.insertId) {// Lanzamos una excepcion error si el usuario no se registra correctamente
                            throw new Error('en controller, create: Error al tratar de registrar en base el usuario');
                        }

                        console.log('en controller, create: Usuario registrado correctamente:', result);// borrar

                        const token = generateToken({// Generamos token
                            id: result.insertId,// Usamos result.insertId en lugar de id_usuarios porque es una respuesta de mysql al generar unnuevo id
                            usuario: userEntity.usuario,
                            email: userEntity.email,
                            rol: 'Cliente'
                        });

                        res.json({ success: true, message: 'en controller, create: Usuario registrado exitosamente', result, userEntity, token });// Enviamos la respuesta de exito
                        
            } catch (error) {// Atrapamos errores y los personalizamos segun el caso
                    let errorMessage;
            
                    if (error.message.includes('validation')) {
                        errorMessage = 'en controller, create: Error de validación de datos del usuario';

                    } else if (error.message.includes('database')) {
                        errorMessage = 'en controller, create: Error de base de datos al registrar el usuario';

                    } else {
                        errorMessage = 'en controller, create: OTRO Error al registrar el nuevo usuario';
                    }
            
                    res.status(500).json({ success: false, message: errorMessage, error: error.message});// Enviamos una respuesta de error personalizada
                }
    }

    /* -------------------- */

    async updateUser(req = request, res = response) {
        try {
            const id = req.user?.id || req.user?.id_usuarios;  // Verificación adicional para obtener el id correctamente
            const userEntity = req.body;

            if (!id) {
                throw new Error("en controller, update: ID de usuario no definido");
            }

            const updatedFields = {}; // Filtro campos undefined para no pasar datos null
            for (const key in userEntity) {
                    if (userEntity.hasOwnProperty(key) && userEntity[key] !== undefined) {
                        updatedFields[key] = userEntity[key];
                    }
            }

            const result = await this.model.update(updatedFields, id);

            res.status(200).json({ success: true, result });

        } catch (error) {

                res.status(500).json({ error: `en controller, update: Error al actualizar usuario: ${error.message}` });
            }
    }
    
    /* -------------------- */

    async softDeleteUser(req = request, res = response) {
        try {
            const id = req.params.id;
    
            if (!id) {
                return res.status(400).json({ error: 'en controller, softDelete: ID de usuario no proporcionado' });
            }
    
            const updatedFields = { status: 'inactivo' }; // Cambia el estado a 'inactivo'
            
            const result = await this.model.update(updatedFields, id);
    
            res.status(200).json({ success: true, message: 'en controller, softDelete: Usuario marcado como inactivo', result });
        } catch (error) {
            res.status(500).json({ error: `en controller, softDelete: Error al marcar usuario como inactivo: ${error.message}` });
        }
    }

    /* -------------------- */

    async deleteUser(req = request, res = response) {
        try {
            const id = req.params.id;
            const result = await this.model.delete(id);
            res.json({ result, id });

        } catch (error) {
            res.status(500).json({ message:'en controller, delete: ', error: error.message });
        }
    }

}


module.exports = UsersController;

