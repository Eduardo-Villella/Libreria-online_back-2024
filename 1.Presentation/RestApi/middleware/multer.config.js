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
        console.log('en multer Archivo recibido en Multer req.file: ', req.file);// borrar AGREGADO PARA VER REQ:FILE
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
        console.log('req.body en multer.config, dentro de fileFilter : req.body :', req.body);// borrar
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
        console.log('en multer Allowed types:', allowedTypes, 'Tipo de archivo:', req.body.type);// borrar

        if (allowedTypes.includes(file.mimetype)) {
            console.log('4 req.body en multer.config, allowedTypes:', allowedTypes, req.body.type);//borrar
            cb(null, true);
        } else {
            cb(new Error('en multer: Tipo de archivo no permitido'));
        }
    }
}).single('file'); // Cambiar el metodo si es necesario (single, array, etc.)

module.exports = upload;

