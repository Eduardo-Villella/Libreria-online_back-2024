const BaseRepository = require('./base.repository');

class BookRepository extends BaseRepository { //Se crea una clase para book que extiende de BaseRepository
    constructor(){
        super('libros', 'id_libros');// Pasa 'id_libros' como campo de identificacion; // Atencion como se debe llamar con las comillas separadas: 'unArgumento', 'otroArgumento'
        // Al inicializar BaseRepository con el nombre de la tabla 'libros', todas las operaciones definidas en BaseRepository se aplican a la tabla
    }

     /* -------------------------- Metodos específicos para BookRepository ------------------ */

    /*async getAll() {
        const sql = `SELECT libros.*, categoria.nombre_cat as categoria FROM ${this.tableName} LEFT JOIN categoria ON categoria.id_categoria = libros.categoria_id`;
        return await this.query(sql);
    }

    async findById(id) {
        const sql = `SELECT libros.*, categoria.nombre_cat as categoria FROM ${this.tableName} LEFT JOIN categoria ON categoria.id_categoria = libros.categoria_id WHERE libros.id_libros = ?`;
        return await this.query(sql, [id]);
    }*/

    //borra todo para abajo -------------------- borrar
    /*async delete(id){
        const sql = `delete from ${this.tableName} where id_libros = ${id}`;
        return await this.query(sql, [id]);
    }

    async update(entity, id){
        this.extractData(entity);

        const clouse = this.fields.map(field => `${field}=?`).join(', ');
        const sql = `UPDATE ${this.tableName} SET ${clouse} WHERE id_libros = ?`;
        return await this.query(sql, [...this.values, id]);
    }*/
}


module.exports = BookRepository;

