/*const express = require('express');
const multer = require('multer');
const path = require('path');

const { UsersController } = require('../controllers/index');
const usersController = new UsersController();

// Middleware asíncrono para preparar la configuración de multer
const uploadMulter = async (req, res, next) => {
    try {
        // Realiza la consulta a la base de datos o cualquier otro proceso asíncrono
        const userId = req.body.id; // Supongamos que necesitas userId de req.body
        const onlyFileName = req.body.originalFileName;
        const user = await usersController.getById(userId); // Consulta para obtener el usuario
        const link = user.imagen_link;
        console.log('en multer 1 req.body.id:', userId);//Borrar
        console.log('en multer 1 req.body.originalFileName:', onlyFileName);//Borrar
        console.log('en multer 2 usersController.getById(userId):', user);//Borrar
        console.log('en multer 2 user.imagen_link:', link);//Borrar

        // Define el directorio de subida y el nombre del archivo
        let uploadPath;
        if (req.body.type === 'user') {
            uploadPath = path.join(__dirname, '../../../4.Upload/users');
        } else if (req.body.type === 'book') {
            uploadPath = path.join(__dirname, '../../../4.Upload/books');
        } else {
            uploadPath = path.join(__dirname, '../../../4.Upload/others');
        }

        const filename = `${onlyFileName.replace(/ /g, '_')}`;
        const enlace = path.join(uploadPath, filename);
        console.log('en multer 3 onlyFileName.replace:', filename);//Borrar
        console.log('en multer 3 path.join:', enlace);//Borrar
        console.log('en multer 3 uploadPath:', uploadPath);//Borrar

        if (link === enlace) {
            return res.status(409).json({ 
                success: false, 
                message: 'El nombre de la imagen ya existe. ¿Desea cambiar el nombre, subir otra imagen o reemplazar la existente?', 
                options: ['cambiar_nombre', 'subir_otra_imagen', 'reemplazar_existente']
            });
        }

        // Configuración de Multer
        const getMulterConfig = (uploadPath) => multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, uploadPath); // Usar uploadPath para la ruta de destino
                },
                filename: (req, file, cb) => {
                    const filename = `${file.originalname.replace(/ /g, '_')}`;
                    cb(null, filename); // Usar el nombre del archivo original
                }
            }),
            fileFilter: (req, file, cb) => {
                const fileTypes = {
                    user: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/svg', 'image/webp'],
                    book: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/svg', 'image/webp', 'application/pdf', 'text/plain'],
                    others: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/svg', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] // Incluye tipos de documentos adicionales
                };
                const allowedTypes = fileTypes[req.body.type] || [];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Tipo de archivo no permitido'));
                }
            }
        }).single('file'); // Cambia el método si es necesario (single, array, etc.)

        // Configurar Multer
        const upload = getMulterConfig(uploadPath);
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error al subir el archivo.' });
            }
            next(); // Continúa al siguiente middleware
        });

    } catch (error) {
        next(error); // Manejo de errores
    }
};

module.exports = uploadMulter;
*/

const multer = require('multer');
const path = require('path');

// Configuracion del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        console.log('req.body en multer.config, req.body uploadPath:', req.body, typeof(req.body), uploadPath);//borrar

        // Definimos la ruta de guardado según el tipo de archivo
        if (req.body.type === 'user') {
            uploadPath = path.join(__dirname, '../../../4.Upload/users');
        } else if (req.body.type === 'book') {
            uploadPath = path.join(__dirname, '../../../4.Upload/books');
        } else {
            uploadPath = path.join(__dirname, '../../../4.Upload/others');
        }
        
        req.uploadPath = uploadPath;// Guardamos uploadPath en req para que esté disponible en el controlador
        console.log('2 req.body en multer.config, req.body uploadPath:', req.body, typeof(req.body), uploadPath);//borrar
        cb(null, uploadPath); // Especificamos la carpeta de destino
    },
    filename: (req, file, cb) => {
        // Asignamos el nombre del archivo reemplazando espacios por guiones bajos y agregando el momento con: _${Date.now()} para evitar coincidencias
        const fileName = `${file.originalname.replace(/ /g, '_')}`;//Si no se agrega Date, verificar existencia del nombre antes en controller
        
        req.fileName = fileName;// Guardamos fileName en req para que esté disponible en el controlador
        console.log('2 req.body en multer.config, fileName:', fileName);//borrar
        cb(null, fileName);// Pasamos el nombre del archivo a la función cb
    }
});

// Configuracion del middleware
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('en multer.config, file.mimetype:', file.mimetype);// borrar
        console.log('en multer.config, file.mimetype type:', typeof(file.mimetype));// borrar
        console.log('req.body en multer.config, req.body fileFilter:', req.body);// borrar
        console.log('req.body en multer.config, req.body.type fileFilter:', req.body.type);// borrar
        console.log('req.body en multer.config, tipo de req.body fileFilter:', typeof(req.body));// borrar

        const fileTypes = {
            user: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/svg', 'image/webp'],
            book: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/svg', 'image/webp', 'application/pdf', 'text/plain'],
            others: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif', 'image/svg', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] // Incluye tipos de documentos adicionales
        };
        console.log('3 req.body en multer.config, req.body fileFilter:', req.body);//borrar
        console.log('3 req.body en multer.config, req.body.type fileFilter:', req.body.type);//borrar
        console.log('3 req.body en multer.config, tipo de req.body fileFilter:', typeof(req.body));//borrar
        const allowedTypes = fileTypes[req.body.type] || [];
        if (allowedTypes.includes(file.mimetype)) {
            console.log('4 req.body en multer.config, allowedTypes:', allowedTypes, req.body.type);//borrar
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
}).single('file'); // Cambiar el metodo si es necesario (single, array, etc.)

module.exports = upload;
