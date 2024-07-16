const BookRepository = require('../../3.Persistence/DAO.MySql/DAO.Repositories/index');
const validator = require('../../1.Presentation/helpers/Utils/validator');

class BookModel {
    constructor() {
        this.repository = new BookRepository();
    }

    async getById(id) {
        try {
            const result = await this.repository.findById(id);
            return result;

        } catch (error) {
            console.error('en book.model: Error en getById:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const result = await this.repository.findAll();
            return result;

        } catch (error) {
            console.error('en book.model: Error en getAll:', error);
            throw error;
        }
    }

    async criteria(criteria) {
        try {
            const result = await this.repository.findByCriteria(criteria);
            return result;

        } catch (error) {
            console.error('en book.model: Error en criteria:', error);
            throw error;
        }
    }

    async create(bookEntity) {
        try {
            validator.validateBook(bookEntity);
            const result = await this.repository.add(bookEntity);
            return result;

        } catch (error) {
            console.error('en book.model: Error en create:', error);
            throw error;
        }
    }

    async update(bookEntity, id) {
        try {
            validator.validateBook(bookEntity);
            const result = await this.repository.update(bookEntity, id);
            return result;

        } catch (error) {
            console.error('en book.model: Error en update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const result = await this.repository.delete(id);
            return result;

        } catch (error) {
            console.error('en book.model: Error en delete:', error);
            throw error;
        }
    }

}


module.exports = BookModel;

