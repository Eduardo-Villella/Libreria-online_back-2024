const mysql = require('mysql2');
require('dotenv').config();

class DataBaseServer {
    constructor() {
        this.port = process.env.DB_PORT; // Guardamos como propiedad el puerto para luego mostrarlo
        this.name = process.env.DB_NAME; // Guardamos como propiedad el nombre de la base de datos para luego mostrarlo
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: this.port,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: this.name,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }).promise();
    }
    
    //Creamos, si no existe, o confirmamos la base de datos
    async dbReady() {
        const dbConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: this.port,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }).promise();

        try {
            await dbConnection.query(`CREATE DATABASE IF NOT EXISTS \`${this.name}\`;`);
                console.log(`dbconfig say: Database ${this.name} is ready.`);

        } catch (error) {
            console.error(`dbconfig say: Error checking/creating database ${this.name}:`, error);

        } finally {
            await dbConnection.end();
        }
    }

    //inicializamos y guardamos estos datos que seran llamados al momento de Instanciar la clase
    dbConnection() {
        return this.pool;
    }

    dbPort() {
        return this.port;
    }
    
    dbName() {
        return this.name;
    }

}


module.exports = DataBaseServer;

