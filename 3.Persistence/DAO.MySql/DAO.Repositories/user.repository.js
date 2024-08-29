const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository { //Se crea una clase para user que extiende de BaseRepository
    constructor(){
        super('usuarios', 'id_usuarios'); // Pasa id_usuarios como campo de identificacion); 
        // Atencion como se debe llamar con las comillas separadas: 'unArgumento', 'otroArgumento' 
        // Al inicializar BaseRepository con el nombre de la tabla usuarios, todas las operaciones definidas en BaseRepository se aplican a la tabla
    }

    /* -------------------------- Metodos específicos para UserRepository ------------------ */

    async findByEmail(email) {// Para buscar por email
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const results = await this.query(sql, [email]);
        return results.length > 0 ? results[0] : null;
    }

    async verifyCredentials(email, password) {// Para verificar las credenciales del usuario. Sirve de filtro al devolver true o false
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ? AND password = ?`;
        const users = await this.query(sql, [email, password]);
        return users.length > 0 ? users[0] : null; // Devuelve el usuario si las credenciales son correctas
    }

}


module.exports = UserRepository;

