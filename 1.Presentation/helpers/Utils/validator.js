/* En este archivo (no confundir con la biblioteca Validator) usaremos joi, otra biblioteca de validacion que permite definir esquemas 
usando la estructura de los campos de las tablas de la base de datos y luego validarlos contra objetos recibidos. 
Se usa principalmente en controllers y/o models asegurando asi que los datos recibidos sean validados antes de llegar a la capa de repositories */

const Joi = require('joi');
const moment = require('moment'); // Para las fechas
require('moment/locale/es'); // Importa el idioma español

moment.locale('es'); // Establece el idioma en español


class Validator {
    constructor() {// Cambio todos a optional para permiotir guardar datos parciales, restringir en frontend si es requerido
        this.userSchema = Joi.object({
            usuario: Joi.string().max(45).optional(),
            email: Joi.string().max(100).optional(),// Cambio type .email() por .string() para que acepte otros email ejemplo: quien_lo-hizo@fui.yo // Modificar agregando .email().pattern(/RegExp personalizada/)
            password: Joi.string().min(8).max(255).optional(),// Cambio max(45) por max(255) para permitir extension al hashear la contraseña
            nombre: Joi.string().max(45).optional(),
            apellido: Joi.string().max(45).optional(),
            // Comienza validacion de fechas
            fecha_nacimiento: Joi.string().optional().allow(null).custom((value, helpers) => {// Convertir fecha_nacimiento a formato YYYY-MM-DD
                if (!value) return value;
                // Intentar convertir la fecha a un formato estandar usando moment
                const acceptedFormats = ['DD-MM-YYYY', 'YYYY-MM-DD', 'dddd D [de] MMMM [de] YYYY']; // Agregar mas formatos si es necesario aqui
                const date = moment(value, acceptedFormats, true); // 'true' asegura que solo formatos validos sean aceptados
                if (!date.isValid()) {
                    return helpers.error('any.invalid', { message: 'Formato de fecha inválido' });// Si el formato es invalido
                }
                return date.format('YYYY-MM-DD');// Retornar la fecha en formato ISO (YYYY-MM-DD) para almacenarla en la base de datos
            }, 'Fecha válida'),
            // Finaliza validacion de fechas
            telefono: Joi.string().max(45).optional(),
            direccion: Joi.string().max(255).optional(),
            ciudad: Joi.string().max(100).optional(),
            provincia: Joi.string().max(100).optional(),
            pais: Joi.string().max(45).optional(),
            codigo_postal: Joi.string().max(45).optional(),
            rol: Joi.string().valid('Administrador', 'Cliente').when('$isUpdate', { is: true, then: Joi.optional(), otherwise: Joi.string().default('Cliente')}),
            status: Joi.string().valid('activo', 'inactivo').when('$isUpdate', { is: true, then: Joi.optional(), otherwise: Joi.string().default('activo') }),
            imagen_name: Joi.string().optional().allow(null),
        });

        this.categorySchema = Joi.object({
            nombre_cat: Joi.string().max(45).optional()
        });

        this.bookSchema = Joi.object({
            nombre: Joi.string().max(200).optional(),
            categoria_id: Joi.number().integer().optional(),
            editorial: Joi.string().max(200).optional(),
            precio: Joi.number().precision(2).optional(),
            stock: Joi.number().integer().optional(),
            descripcion: Joi.string().optional(),
            imagen_link: Joi.string().max(255).optional().allow(null),
            imagen: Joi.binary().optional().allow(null)
        });

        this.cartSchema = Joi.object({
            usuario_id: Joi.number().integer().optional()
        });

        this.cartDetailSchema = Joi.object({
            carrito_id_carrito: Joi.number().integer().optional(),
            libros_id: Joi.number().integer().optional(),
            cantidad_producto: Joi.number().integer().optional(),
            precio_total: Joi.number().precision(2).optional()
        });
    }

    // FIN SHEMAS - SIGUEN VALIDADORES //

 /* ---------------------------------------------------------------------------------------- */

    // Filtra el objeto de usuario para incluir solo los campos definidos en el esquema
    filterUserFields(userEntity) {
        const filteredUser = {};
        for (const key in userEntity) {
            if (this.userSchema.describe().keys[key] || ['originalFileName', 'type'].includes(key)) {
                filteredUser[key] = userEntity[key];
            }
        }
        return filteredUser;
    }
    // Funcion de validacion de user
    validateUser(userEntity, isUpdate = false) {
        const schemaContext = { isUpdate };
    
        const filteredUser = this.filterUserFields(userEntity);
        const { error, value } = this.userSchema.validate(filteredUser, {
            stripUnknown: true,
            context: schemaContext // Pasa el contexto para la validacion
        });
    
        if (error) {
            throw error;
        }

        Object.keys(userEntity).forEach(key => {
            if (!(key in value)) {
                delete userEntity[key];
            }
        });
    
        Object.assign(userEntity, value);
        return userEntity;
    }  

/* ---------------------------------------------------------------------------------------- */

    validateCategory(category) {
        const { error } = this.categorySchema.validate(category);
        if (error) {
            throw new Error(`en validator.js: Dato categoria invalido: ${error.message}`);
        }
    }

/* ---------------------------------------------------------------------------------------- */

    validateBook(book) {
        const { error } = this.bookSchema.validate(book);
        if (error) {
            throw new Error(`en validator.js: Dato libro invalido: ${error.message}`);
        }
    }

/* ---------------------------------------------------------------------------------------- */

    validateCart(cart) {
        const { error } = this.cartSchema.validate(cart);
        if (error) {
            throw new Error(`en validator.js: Dato carrito invalido: ${error.message}`);
        }
    }

/* ---------------------------------------------------------------------------------------- */
    validateCartDetail(cartDetail) {
        const { error } = this.cartDetailSchema.validate(cartDetail);
        if (error) {
            throw new Error(`en validator.js: Dato detalle carrito invalido: ${error.message}`);
        }
    }

}


module.exports = new Validator();

