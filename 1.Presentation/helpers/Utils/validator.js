/* En este archivo (no confundir con la biblioteca Validator.js) usaremos joi, biblioteca de validacion que permite definir esquemas 
usando la estructura de los campos de las tablas de la base de datos y luego validarlos contra objetos recibidos. 
Se usa principalmente en controllers y/o models asegurando asi que los datos recibidos sean validados antes de llegar a la capa de repositories */

const Joi = require('joi');

class Validator {
    constructor() {// Cambio todos a optional para permiotir guardar datos parciales, restringir en frontend si es requerido
        this.userSchema = Joi.object({
            usuario: Joi.string().max(45).optional(),
            email: Joi.string().max(100).optional(),// Cambio type .email() por .string() para que acepte otros email ejemplo: quien_lo-hizo@fui.yo // Modificar agregando .email().pattern(/RegExp personalizada/)
            password: Joi.string().min(8).max(255).optional(),// Cambio max(45) por max(255) para permitir extension al hashear la contraseña
            nombre: Joi.string().max(45).optional(),
            apellido: Joi.string().max(45).optional(),
            fecha_nacimiento: Joi.date().optional().allow(null),
            telefono: Joi.string().max(45).optional(),
            direccion: Joi.string().max(255).optional(),
            ciudad: Joi.string().max(100).optional(),
            provincia: Joi.string().max(100).optional(),
            pais: Joi.string().max(45).optional(),
            codigo_postal: Joi.string().max(45).optional(),
            rol: Joi.string().valid('administrador', 'cliente').default('cliente'),
            estado: Joi.string().valid('activo', 'inactivo').default('activo'),
            imagen_perfil: Joi.binary().optional().allow(null)
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

    validateUser(user) {
        const { error } = this.userSchema.validate(user);
        if (error) {
            throw new Error(`en validator.js: Dato usuario invalido: ${error.message}`);
        }
    }

    validateCategory(category) {
        const { error } = this.categorySchema.validate(category);
        if (error) {
            throw new Error(`en validator.js: Dato categoria invalido: ${error.message}`);
        }
    }

    validateBook(book) {
        const { error } = this.bookSchema.validate(book);
        if (error) {
            throw new Error(`en validator.js: Dato libro invalido: ${error.message}`);
        }
    }

    validateCart(cart) {
        const { error } = this.cartSchema.validate(cart);
        if (error) {
            throw new Error(`en validator.js: Dato carrito invalido: ${error.message}`);
        }
    }

    validateCartDetail(cartDetail) {
        const { error } = this.cartDetailSchema.validate(cartDetail);
        if (error) {
            throw new Error(`en validator.js: Dato detalle carrito invalido: ${error.message}`);
        }
    }

}


module.exports = new Validator();

