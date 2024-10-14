const DataBaseServer = require('../db.config');

async function booksAndCategoriesTables() {
    const dbServer = new DataBaseServer();
    const dbConnection = await dbServer.dbConnection();

    try {
        // Crear tabla categoria
        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS categoria (
                id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                nombre_cat VARCHAR(45)
            );`
        );
        console.log('Category table has been created or already exists.');

        // Crear tabla libros
        await dbConnection.query(
            `CREATE TABLE IF NOT EXISTS libros (
                id_libros INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(45) NOT NULL,
                categoria_id INT NOT NULL,
                editorial VARCHAR(45) NOT NULL,
                precio DECIMAL(10,0) NOT NULL,
                stock INT NOT NULL,
                descripcion VARCHAR(1000) NOT NULL,
                imagen_link VARCHAR(255),
                status ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
                FOREIGN KEY (categoria_id) REFERENCES categoria(id_categoria)
            );`
        );
        console.log('Books table has been created or already exists.');

    } catch (error) {
        console.error('Error creating books or categories tables:', error);
    } finally {
        dbConnection.release();
    }
}

module.exports = booksAndCategoriesTables;
