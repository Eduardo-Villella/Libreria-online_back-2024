const bcrypt = require('bcrypt');

const UserRepository = require('../../3.Persistence/DAO.MySql/DAO.Repositories/user.repository');
const validator = require('../../1.Presentation/helpers/Utils/validator');

class UserModel {
    constructor() {
        this.repository = new UserRepository();
    }

    async getById(id) {
        try {
            const result = await this.repository.findById(id);
            console.log('en model en getById, result: ', result);
            return result;

        } catch (error) {
            console.error('en user.model: Error en getById:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const result = await this.repository.findAll();
            return result;

        } catch (error) {
            console.error('en user.model: Error en getAll:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const result = await this.repository.findByEmail(email);
            return result;

        } catch (error) {
            console.error('en user.model: Error en findByEmail:', error);
            throw error;
        }
    }

    async criteria(criteria, joins = []) {
        try {
            console.log('en user.model, criterios recibidos y joins:', criteria, joins); //borrar Ver los datos recibidos
            console.log('en user.model, tipos criterios recibidos y joins:', typeof(criteria), typeof(joins)); //borrar Ver los datos recibidos

            if (!Array.isArray(joins)) {// Comprueba si se recibe joins y asignar el valor correspondiente
                joins = []; // Si no se recibe un array, lo establecemos como un array vacio
            }
            const tableName = 'usuarios';

            const result = await this.repository.findByCriteria(tableName, criteria, joins);
            console.log('en user.model criteria criteriaQuery result y tipo:', result, typeof(result));// borrar
            return result;

        } catch (error) {
            console.error('en user.model: Error en criteria:', error);
            throw error;
        }
    }

    async verifyCredentials(email, password) {// Este metodo se usa desde aqui sin refactorizar en controller ya que alli se lo aplica.
        try {
            const user = await this.repository.findByEmail(email);
            if (!user) {
                return null; // Email no encontrado
            } else {
                const isMatch = await bcrypt.compare(password, user.password);// Compara contraseña
                return isMatch ? user : false; // Devuelve user si es ok o false si es contraseña incorrecta
            }

        } catch (error) {
            console.error('en user.model: Error en verifyCredentials:', error);
            throw error;
        }
    }

    async create(userEntity) {// Comprobando
        try {
            validator.validateUser(userEntity);
            console.log('en user.model, create: despues de validator userEntity:', userEntity); // borrar
            const result = await this.repository.add(userEntity);
            console.log('en user.model, create: Result en repository.add:', result); // borrar
            return result;

        } catch (error) {
            console.error('en user.model: Error en create:', error);
            throw error;
        }
    }

    async update(userEntity, id) {
        try {
            validator.validateUser(userEntity, true); // 'true' indica que es una actualizacion parcial
            console.log('en user.model, update: despues de validator userEntity:', userEntity); // borrar
            const result = await this.repository.update(userEntity, id);
            console.log('en user.model, update: Result en repository.add:', result); // borrar
            return result;

        } catch (error) {
            console.error('en user.model: Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await this.repository.delete(id);
            return result;
            
        } catch (error) {
            console.error('en user.model: Error en delete:', error);
            throw error;
        }
    }


}


module.exports = UserModel;

