/* Archivo independiente del proyecto para modificar DB: script para hashear contraseñas guardadas en DB como texto plano, antes de implementar bcrypt */
/* ejecutar desde la raiz: \proyecto-api> node 1.Presentation/helpers/Utils/bcrypt.reHashed.js */

require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const saltRounds = 10;

/* -------------------- Configuración de conexión con DB --------------------- */
async function hashing() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
        
    });

    /* -------------------- Funciones para trabajar con DB ------------------------ */
    async function getAll() {
        const [rows] = await connection.query('SELECT * FROM usuarios');
        return rows;
    }

    async function update(id, updatedFields) {
        if (id) { // Asegúrate de que id no sea null o undefined
            const query = 'UPDATE usuarios SET ? WHERE id_usuarios = ?'; // Actualizado el nombre de la columna aquí
            await connection.query(query, [updatedFields, id]);
        } else {
            console.log(`El ID del usuario es inválido: ${id}`);
        }
    }

    /* -------------------- Script para modificar contraseñas sin hash en DB -------------- */

    // Función para verificar si la contraseña ya está hasheada
    function isPasswordHashed(password) {
        return password && password.length === 60 && password.startsWith('$2b$'); // Verifica la longitud y formato del hash de bcrypt
    }

    async function hashPasswords() {
        const users = await getAll(); // Busca todos los registros

        for (const user of users) {
            if (!isPasswordHashed(user.password)) { // Aplica la función isPasswordHashed que verifica si la contraseña ya está hasheada
                const hashedPassword = await bcrypt.hash(user.password, saltRounds); // Hashea la contraseña
                await update(user.id_usuarios, { password: hashedPassword }); // Guarda los datos
                console.log(`Contraseña para el usuario ${user.id_usuarios} actualizada.`);
            } else {
                console.log(`La contraseña para el usuario ${user.id_usuarios} ya está hasheada.`);
            }
        }

       
        await connection.end();// Cierra la conexion
    }

    await hashPasswords().catch(console.error);

}


hashing();

// Otro script para hashear una contraseña y agregarla por linea de comando
/*
const bcrypt = require('bcrypt');

const password = 'administradorDEprueba'; // La contraseña en texto plano
const saltRounds = 10; // Número de rondas de sal

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log(`Contraseña hasheada: ${hash}`);
        // Copia el hash generado y actualiza la base de datos
    }
});
*/
// Luego desde consola ejecutar una linea mysql, como el siguiente ejemplo:
/* mysql>UPDATE usuarios SET password = 'hash_generado' WHERE email = 'administrador@admin.ad'; */