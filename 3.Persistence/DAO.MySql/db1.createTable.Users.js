const DataBaseServer = require('../db.config'); // Importamos la configuracion de la base de datos

async function usersTable() {
    const dbServer = new DataBaseServer(); // Instancia del servidor de la base de datos
    const dbConnection = await dbServer.dbConnection(); // Obtenemos la conexion de la base de datos
    
    try {
        // Ejecutamos la consulta para crear la tabla si no existe
        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS usuarios (
                id_usuarios INT AUTO_INCREMENT PRIMARY KEY,
                usuario VARCHAR(45) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255),
                nombre VARCHAR(45),
                apellido VARCHAR(45),
                fecha_nacimiento DATE,
                telefono VARCHAR(45),
                direccion VARCHAR(45),
                ciudad VARCHAR(45),
                provincia VARCHAR(45),
                pais VARCHAR(45),
                codigo_postal VARCHAR(45),
                rol ENUM('Administrador', 'Cliente') NOT NULL DEFAULT 'Cliente',
                status ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
                imagen_name VARCHAR(255) DEFAULT 'user-anonymous.png'
            );`
        );
        console.log('Users table has been created or already exists.');

    } catch (error) {
        console.error('Error creating Users table:', error);
    } finally {
        dbConnection.release(); // Liberamos la conexion
    }
}

module.exports = usersTable; // Exportamos la funcion
