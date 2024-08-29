const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();//Se requiere para usar variables de entorno
//const fileUpload = require('express-fileupload');// Se anula porque se usara multer y static para majar archivos/imagenes

class RestApiServer {
    constructor() {
        this.server = express();
        this.port = process.env.RESTAPI_PORT;//RESTAPI_PORT reperesenta el puerto del servidor -server backend- en archivo .env
        this.uploadPath = path.join(__dirname, '../../4.Upload');// Ruta a la carpeta donde se buscaran los archivos/imagenes
        console.log(`Upload path desde rest.server: ${this.uploadPath}`);// borrar
        this.middlewares();// Inicializo middleware
        this.routes();// Inicializo routes
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));// Para datos URL-encoded
        this.server.use(cors());
        this.server.use('/api/4.Upload', express.static(this.uploadPath));// Sirve la carpeta 4.Upload de forma estatica para que las imagenes sean accesibles
        //this.server.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));// Se anula porque se usara multer en el manejo de los uploads
        //Agregar aqui otros middleware (recordar importacion si es necesario)
    }

    routes() {
        this.server.use('/api/books', require('./routes/book.routes'));
        this.server.use('/api', require('./routes/front.static.routes'));//Agregada para obtener /config desde front.static.routes.js en fronteend get
        this.server.use('/api/users', require('./routes/user.routes'));//Agregada para usuarios
        this.server.use('/api/categories', require('./routes/category.routes'));
        //Agregar aqui otras rutas
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Rest Api server initiated on  port: ${this.port}`);
        });
    }
    
}


module.exports = RestApiServer;

