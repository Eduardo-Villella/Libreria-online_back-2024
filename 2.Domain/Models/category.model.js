const BookRepository = require('../../3.Persistence/DAO.MySql/DAO.Repositories/index');
const validator = require('../../1.Presentation/helpers/Utils/validator');

class CategoryModel {
    constructor() {
        this.repository = new CategoryRepository();
    }

    async getAllCategories() {
        try {
            return await this.repository.getAll();
        } catch (error) {
            throw new Error(`en category.model: Error al obtener todas las categorías: ${error.message}`);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await this.repository.findById(id);
            if (!category) {
                throw new Error(`en category.model: No se encontró ninguna categoría con el ID: ${id}`);
            }
            return category;
        } catch (error) {
            throw new Error(`en category.model: Error al obtener la categoría por ID: ${error.message}`);
        }
    }

    async createCategory(category) {
        try {
            this.validator.validateCategory(category); // Validación del objeto categoría antes de crear
            return await this.repository.add(category);
        } catch (error) {
            throw new Error(`en category.model: Error al crear la categoría: ${error.message}`);
        }
    }

    async updateCategory(category, id) {
        try {
            this.validator.validateCategory(category); // Validación del objeto categoría antes de actualizar
            const updatedCategory = await this.repository.update(category, id);
            if (!updatedCategory) {
                throw new Error(`en category.model: No se pudo actualizar la categoría con el ID: ${id}`);
            }
            return updatedCategory;
        } catch (error) {
            throw new Error(`en category.model: Error al actualizar la categoría: ${error.message}`);
        }
    }

    async deleteCategory(id) {
        try {
            const deletedCategory = await this.repository.delete(id);
            if (!deletedCategory) {
                throw new Error(`en category.model: No se encontró ninguna categoría con el ID: ${id}`);
            }
            return deletedCategory;
        } catch (error) {
            throw new Error(`en category.model: Error al eliminar la categoría: ${error.message}`);
        }
    }

}


module.exports = CategoryModel;

