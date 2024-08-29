const { request, response } = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

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
            const id = req.params.id || req.user?.id || req.user?.id_usuarios || req.body?.id || req.body?.id_usuarios;
            if (!id || isNaN(id)) {// Valida que el ID es un numero
                return res.status(400).json({ message: 'en controller getById: ID de usuario no válido', error: error.message });
            }
            const result = await this.model.getById(id);
            if (!result) {
                return res.status(404).json({ message: 'en controller getById: Usuario no encontrado', error: error.message });
            }
            res.json( result );

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
                return res.status(204).json({ status: false, message: 'en controller findByEmail: Usuario no encontrado' });
            }
            res.status(200).json({ status: true, result });// Si se encuentra el usuario, devolvemos el resultado y el status true
            
        } catch (error) {
            res.status(500).json({ message: 'en controller findByEmail: Error al buscar usuario por email', error: error.message });
        }
    }

    /* -------------------- */

    async verifyCredentials(req =request, res = response) {
        try {
            const { email, password } = req.body; // Extrae email y contraseña del cuerpo de la solicitud
            //console.log('en user.controller verifyCredentials email y password y tipos: ', email, typeof(email), password, typeof(password));//borrar
            const user = await this.model.verifyCredentials(email, password);// Llama a la funcion del modelo para verificar credenciales

            if (!user) {
                console.log('en user.controller verifyCredentials UNO if !user tipo de respuesta: return res.status(200).json({ message: en user.controller, verifyCredentials: success: false, message: Email no encontrado o contraseña incorrecta })');//borrar
                return res.status(200).json({ success: false, message: 'Email no encontrado o contraseña incorrecta' }); // Manejo de error si no se encuentra el usuario
            }

            console.log('en user.controller verifyCredentials DOS succes tipo de respuesta: return res.status(200).json({ success: true, user })');//borrar
            return res.status(200).json({ success: true, user }); // Para el caso exitoso // Devuelve el usuario encontrado

        } catch (error) {
            console.log('en user.controller verifyCredentials TRES catch tipo de respuesta: return res.status(500).json({message: en user.controller verifyCredentials: error enlas credenciales, error: error.message}) ');//borrar
            return res.status(500).json({message: 'en user.controller verifyCredentials: error enlas credenciales', error: error.message});
        }
    }

    /* -------------------- */

    async criteria(req = request, res = response) {
        try {
            const headers = req.headers;//borrar
            console.log(' en UserController, headers:', typeof(headers));//borrar
            const criteria = req.body; // Esperamos que el frontend envie los criterios en el cuerpo de la solicitud
            console.log(' en UserController, Criterios recibidos y tipo:', criteria, typeof(criteria));//borrar
            console.log('en user.controller, criteria, antes de if criteria.password y tipo: ',criteria.password, typeof(criteria.password));//borrar
            if (criteria.password) {
                console.log('en user.controller, criteria, if criteria.password y tipo: ',criteria.password, typeof(criteria.password));//borrar
                const hashedPassword = await bcrypt.hash(criteria.password, 10); // Hashea la contraseña
                console.log('en user.controller, criteria, return if hashedPassword y tipo: ',hashedPassword, typeof(hashedPassword))//borrar
                criteria.password = hashedPassword;
            } 

            console.log('en user.controller, criteria, despues de if: Solicitud recibida en /admin/search req.headers tipo :', typeof(req.headers)); // borrar Ver qué datos se reciben
            console.log('en user.controller, criteria, despues de if:Solicitud recibida en /admin/search req.body y tipo  :', req.body, typeof(req.body)); // borrar Ver qué datos se reciben
            console.log('en user.controller, criteria, if criteria.password y tipo: ', criteria, typeof(criteria));//borrar
            
            const result = await this.model.criteria(criteria);
            console.log(' en UserController, en await busqueda result: Resultado de la consulta y tipo:', result, typeof(result));//borrar

            if (!result || result.length === 0) {
                return res.status(200).json({ success: false, message: 'en controller, criteria: No se encontraron registros que coincidan con los criterios' });
                
                
                //const user = result[0]; // Asumiendo que el resultado es un array y tomamos el primero
                if (result.rol !== 'Administrador') {// si es array cambiar por user.rol y descomentar linea anterior
                    return res.status(200).json({ success: false, message: 'El rol no es administrador' });
                }

                res.status(200).json({ success: true, data: result });
            }

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
            const {
                usuario,
                email,
                password,
                imagen_link,
                nombre,
                apellido,
                fecha_nacimiento,
                telefono,
                direccion,
                ciudad,
                provincia,
                pais,
                codigo_postal,
                rol,
                status,
            } = req.body;// Extraigo todos los campos del body

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

                const userEntity = Object.fromEntries(
                    Object.entries({
                        imagen_link,
                        usuario,
                        email,
                        password,
                        nombre,
                        apellido,
                        fecha_nacimiento,
                        telefono,
                        direccion,
                        ciudad,
                        provincia,
                        pais,
                        codigo_postal,
                        rol,
                        status,
                    }).filter(([_, value]) => value !== "" && value !== undefined && value !== null)
                );

                const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña
                    console.log('en controller, create: Contraseña hasheada:', hashedPassword);// borrar

                userEntity.password = hashedPassword;// Actualiza la entidad del usuario (userEntity) con la contraseña hasheada
                    console.log('en controller, create: Contenido de userEntity después de hashear la contraseña:', userEntity);// borrar

                if (req.file) {
                    // Comprueba si existe en DB, el nombre del archivo 
                    const imagenPerfil = req.file.filename;
                    const imagenPath = path.join('/users', imagenPerfil);
                    const criteria = { imagen_link: imagenPath };

                    const existingImage = await this.model.criteria(criteria);
                    if (existingImage) {
                        return res.status(409).json({success: false, message: 'El nombre de la imagen ya existe. ¿Desea cambiar el nombre, subir otra imagen o reemplazar la existente?', options: ['cambiar_nombre', 'subir_otra_imagen', 'reemplazar_existente']});
                    }
                    // Guarda el link de la imagen en la base de datos
                    //const imagenPath = path.relative(path.join(__dirname, '../../../'), req.file.path);// Genera un path relativo
                    userEntity.imagen_link = imagenPath;// Asigna la ruta de la imagen
                } else {
                    userEntity.imagen_link = '/users/user-anonymous-100.png';
                }

                const result = await this.model.create(userEntity);// Agregamos el usuario utilizando el modelo
                    console.log('en controller, create: Resultado de la creación:', result); //borrar
                if (!result || !result.insertId) {// Lanzamos una excepcion error si el usuario no se registra correctamente
                        throw new Error('en controller, create: Error al tratar de registrar en base el usuario');
                    }

                        console.log('en controller, create: Usuario registrado correctamente:', result);// borrar

                    const token = generateToken({// Generamos token
                        id: result.insertId,// Usamos result.insertId en lugar de id_usuarios porque es una respuesta de mysql al generar un nuevo id
                        usuario: userEntity.usuario,
                        email: userEntity.email
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
            console.log('en controller,update: req.body ', req.body); // borrar
            console.log('en controller,update: req.user:', req.user); // borrar 

            const idFromParams = parseInt(req.params.id, 10); // Obtiene el ID desde los parametros de la ruta y lo convierte a entero 
            const idFromUser = req.user?.id || req.user?.id_usuarios || req.user?.userId; // Obtiene el ID del objeto req.user
            console.log('en controller,update req.user.id, req.user.id_usuarios, req.user.userId: ', req.user.id, req.user.id_usuarios, req.user.userId)// borrar

            const id = idFromParams || idFromUser;// Verifica si idFromParams es valido y, si no, usa idFromUser
            console.log('en controller, update: id', id); // Verifica el ID que se esta utilizando

            if (!id) {
                throw new Error("en controller, update: ID de usuario no definido");
            }

            const userEntity = req.body;

            // Filtra campos undefined y crea el objeto actualizado
            const updatedFields = Object.fromEntries(
                Object.entries(userEntity).filter(([key, value]) => value !== undefined)
            );
            console.log('en controller, update: Campos actualizados:', updatedFields); // borrar Verifica qué campos se están actualizando

            // Si Multer proceso un nuevo archivo, actualiza el campo imagen_link
            if (req.file) {
                const filePath = path.join(req.uploadPath, req.fileName);// Construye el filePath usando la información generada por Multer en req
                
                // Alternativa para generar el path relativo que se guarde en la base de datos (sin incluir la ruta absoluta)
                const relativeFilePath = path.relative(path.join(__dirname, '../../../'), filePath);
                
                updatedFields.imagen_link = relativeFilePath; // Actualiza el campo con el nuevo link
            }

            const result = await this.model.update(updatedFields, id);
            res.status(200).json({ success: true, result });

        } catch (error) {

            res.status(500).json({ error: `en controller, update: Error al actualizar usuario: ${error.message}` });
        }
    }
    
    /* -------------------- */

    async updatePassword(req = request, res = response) {
        try {
            const { email, newPassword } = req.body;
    
            if (!email || !newPassword) {// Verifica que se hayan proporcionado los datos necesarios
                return res.status(400).json({ message: 'Debe proporcionar un email y una nueva contraseña' });
            }
    
            const user = await this.model.findByEmail(email);// Busca el usuario por email
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);// Hashea la nueva contraseña
    
            const userEntity = {// Solo agrega el password a userEntity
                password: hashedPassword 
            };
            
            
            const updatedFields = Object.fromEntries(// Filtrar campos indefinidos
                Object.entries(userEntity).filter(([key, value]) => value !== undefined)
            );

            const result = await this.model.update(updatedFields, user.id_usuarios);// Actualiza la contraseña en la base de datos usando la funcion update
            if (!result) {
                throw new Error('Error al actualizar la contraseña');
            }
    
            res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message });
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

