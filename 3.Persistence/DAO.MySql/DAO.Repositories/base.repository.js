const DataBaseServer = require('../../db.config');// Importamos la configuracion de la conexion a la base

class BaseRepository{ // Creamos clase general para realizar metodos CRUD
    constructor(tableName, idField = 'id') { // Agrega un parámetro idField para indicar el id de cada tabla
        this.tableName = tableName;// Nombre de la tabla elegida en base de datos
        this.idField = idField; // Campo de identificacion en la tabla
        this.dataBaseServer = new DataBaseServer(); // Instanciamos de DataBaseServer
    }

    async query(sql, params){//Se agrega aqui bloque try-catch aqui para el manejo de errores ya que todos los metodos usan this.query
        try{
            const [results, ] = await this.dataBaseServer.dbConnection().execute(sql, params);// Consulta SQL generica con los parametros proporcionados
            return results;

        } catch (error){
            console.error(`base.repository, query: Error ejecutando query: ${sql}`, error);
            throw error;
        }
    }

    // Metodos de busqueda y filtrado

    async findById(id){
        const sql = `SELECT * FROM ${this.tableName} WHERE ${this.idField} = ?`;// Consulta SQL por id
        return await this.query(sql, [id]);// Retorna la ejecucion de la consulta y resultado
    }

    async findAll(entityFields = null){ // entityFields deberia verse como un objeto {field_1, field_2, field_3, etc..}
        const paramsFields = (!entityFields) ? '*' : Object.keys(entityFields).join(', ');// Define los campos a seleccionar por la consulta
        const sql = `SELECT ${paramsFields} FROM ${this.tableName}`;// Consulta para seleccionar todos los registros de la tabla
        return await this.query(sql);// Retorna la ejecucion de la consulta y resultado
    }

    async findByCriteria(tableName, criteria, joins = []) {
        console.log('en base.repository, findByCriteria called with:', { tableName, criteria, joins });//borrar
        let sql = `SELECT ${tableName}.*`;
        console.log('en base.repository, Constructed SQL:', sql);//borrar
    
        for (const join of joins) {
            sql += `, ${join.table}.*`; // Selecciona todas las columnas de las tablas unidas
        }
    
        sql += ` FROM ${tableName}`;
    
        for (const join of joins) {
            sql += ` ${join.type} JOIN ${join.table} ON ${join.on}`;
        }
    
        sql += ' WHERE 1=1';
        const params = [];
        console.log('en base.repository, Parameters for query:', params);//borrar
        
        for (const [key, value] of Object.entries(criteria)) {
            if (value) {
                if (typeof value === 'object' && value.operator && value.value) {
                    sql += ` AND ${key} ${value.operator} ?`;
                    params.push(value.value);
                } else {
                    sql += ` AND ${key} = ?`;
                    params.push(value);
                }
            }
        }
        return await this.query(sql, params);
    }    

    // Metodos de manipulacion de datos

    async extractData(entityObject){ 
        console.log('en repository extractData, Datos a actualizar:', entityObject); // borrar 
        this.fields = Object.keys(entityObject);
        this.values = Object.values(entityObject);
        /* Este metodo: extractData(entitytObject) extrae, interpreta y transforma los datos entre js y sql. Asigna a this.fields un array con los nombres de campos,
         por ejemplo (['id', 'nombre', 'apellido',etc]); y, a this.values un array de los valores correspondientes ([1, 'Eduardo', 'ElBonito', etc]). Permitiendo luego formar el par: clave=valor
        Al igual que todos los metodos, al ser asincrono no importa en que orden de lugar este declarado dentro de la clase.
        Prefiero ponerlo aqui y no al final ya que sera usado por los dos proximos metodos: add y update, asi es mas facil su visualizacion y entendimiento */
    }

    /*async add(entity) { 
                console.log('en baseRepostory, add, entidad recibida, entity: ', entity); // borrar Mostrar entidad recibida
        try {
            this.extractData(entity); // Extrae los datos del objeto entity
            const sql = `INSERT INTO ${this.tableName} (${[...this.fields]}) VALUES (${[...this.values.map(value => `"${value}"`)]})`; // Determina la tabla, los campos y sus valores                                                            
                console.log('en repository, add: Valores extraídos:', this.values); // borrar Log para los valores extraídos
            const result = await this.query(sql, this.values); // Ejecuta la consulta con los valores extraídos
                console.log('en base repository, add: Resultado de la inserción:', result, sql); // borrar Log para el resultado de la inserción
            return result;
        } catch (error) {
            console.error('en base repository add: Error al tratar de insertar en DB:', error);
            throw error; // Re-lanza el error para que pueda ser capturado por quien lo llama
        }
    }*/

    async add(entity) { // Para agregar un nuevo registro a la tabla
        try {
            console.log('en add, entidad recibida:', entity); // Mostrar entidad recibida
            this.extractData(entity); 
            console.log('en add, valores extraídos:', this.values); // Mostrar valores extraídos
            
            const fieldsString = this.fields.join(', ');
            const placeholders = this.fields.map(() => '?').join(', ');
            const sql = `INSERT INTO ${this.tableName} (${fieldsString}) VALUES (${placeholders})`;
            
            console.log('en add, SQL generada:', sql); // Mostrar la consulta SQL generada
            console.log('en add, valores a insertar:', this.values); // Mostrar los valores que se van a insertar
            
            const result = await this.query(sql, this.values); 
            console.log('en base repository, add: Resultado de la inserción:', result); // Log para el resultado de la inserción
            
            return result;
        } catch (error) {
            console.error('en base repository add: Error al tratar de insertar en DB:', error);
            throw error; 
        }
    }
    
    async update(entity, id){ // Actualiza un registro existente en la tabla //
            console.log('en baseRepostory, update, entidad recibida, entity: ', entity); // borrar Mostrar entidad recibida
        this.extractData(entity); // Extrae los datos en dos array: this.fields y this.values (campo y valor)
            console.log('en baseRepostory, update, valores extraídos, this.values:', this.values); // borrar Mostrar valores extraídos
        const clouse = this.fields.map(field => `${field}=?`).join(', ');// Tomamos el array de campos: this.fields y map itera en cada elemento (transformandolo en un array clave=valor "${field}=?") y finalmente .join lo transforma en una cadena de texto entendible para sql
        const sql = `UPDATE ${this.tableName} SET ${clouse} WHERE ${this.idField} = ?`;//Se define sql usando update y this.tableName que es libros y usando set para la cadena de texto que es clouse donde id es igual al ingresado en parametros
            console.log('en baseRepostory, update, SQL generada:', sql); // borrar Mostrar la consulta SQL generada
            console.log('en baseRepostory, update, valores a insertar array this.values, id:', [...this.values, id]); // borrar Mostrar los valores que se van a insertar
        return await this.query(sql, [...this.values, id]);// Finalmente se une todo: const sql + operadr ... para expandir array + this.values +id y devuelve la actualizacion
    }

    async delete(id){// Elimina un registro por su ID
        const sql = `DELETE FROM ${this.tableName} WHERE ${this.idField} = ?`;
        return await this.query(sql, [id]);
    }

}


module.exports = BaseRepository;

