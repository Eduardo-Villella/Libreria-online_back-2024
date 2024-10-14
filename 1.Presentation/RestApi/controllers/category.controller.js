const { request, response } = require('express');
const { CategoryModel } = require('../../../2.Domain/Models/index');


class CategoryController {
    constructor(){
        this.model = new CategoryModel();
    }

    // Query functions
    async getAll(req = request, res = response){
        const result = await this.model.getAllCategories();// Controlar nombres de funciones
        res.json({
            result
        });
    }

    async getById(req = request, res = response){
        const id = req.params.id;
        const result = await this.model.getById(id);

        (result.length > 0)?res.json(result[0]): res.status('404').json();
    }

}

module.exports = CategoryController;

