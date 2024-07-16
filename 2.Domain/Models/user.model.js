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

    async criteria(criteria) {
        try {
            const result = await this.repository.findByCriteria(criteria);
            return result;
        } catch (error) {
            console.error('en user.model: Error en criteria:', error);
            throw error;
        }
    }

    async verifyCredentials(email, password) {// Este metodo se usa desde aqui sin refactorizar en controller ya que alli se lo aplica.
        try {
            const user = await this.repository.findByEmail(email);
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                return isMatch ? user : null;
            }
            return null;
        } catch (error) {
            console.error('en user.model: Error en verifyCredentials:', error);
            throw error;
        }
    }

    async create(userEntity) {
        try {
            validator.validateUser(userEntity);
            const result = await this.repository.add(userEntity);
            return result;
        } catch (error) {
            console.error('en user.model: Error en create:', error);
            throw error;
        }
    }

    async update(userEntity, id) {
        try {
            validator.validateUser(userEntity);
            const result = await this.repository.update(userEntity, id);
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

