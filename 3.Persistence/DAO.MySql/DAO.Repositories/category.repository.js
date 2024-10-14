const baseRepository = require('./base.repository');

class CategoryRepository extends baseRepository{
    constructor(){
        super('categoria', 'id_categoria');// Atencion como se debe llamar con las comillas separadas: 'unArgumento', 'otroArgumento' 
    }

}


module.exports = CategoryRepository;

