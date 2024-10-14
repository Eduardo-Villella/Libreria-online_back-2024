const DataBaseServer = require('../db.config');

async function cartsAndDetailsTables() {
    const dbServer = new DataBaseServer();
    const dbConnection = await dbServer.dbConnection();

    try {
        // Crear tabla carrito
        await dbConnection.query(`
            CREATE TABLE IF NOT EXISTS carrito (
                id_carrito INT AUTO_INCREMENT PRIMARY KEY,
                usuarios_id INT NOT NULL,
                FOREIGN KEY (usuarios_id) REFERENCES usuarios(id_usuarios)
            );
        `);
        console.log('Cart table has been created or already exists.');

        // Crear tabla detalle_carrito
        await dbConnection.query(`
            CREATE TABLE IF NOT EXISTS detalle_carrito (
                carrito_id_carrito INT NOT NULL,
                libros_id INT NOT NULL,
                cantidad_producto INT NOT NULL,
                PRIMARY KEY (carrito_id_carrito, libros_id),
                FOREIGN KEY (carrito_id_carrito) REFERENCES carrito(id_carrito),
                FOREIGN KEY (libros_id) REFERENCES libros(id_libros)
            );
        `);
        console.log('Cart details table has been created or already exists.');

    } catch (error) {
        console.error('Error creating cart or cart details tables:', error);
    } finally {
        dbConnection.release();
    }
}

module.exports = cartsAndDetailsTables;
