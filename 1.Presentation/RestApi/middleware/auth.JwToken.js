// Archivo middleware JW token para autentificar sesion usuarios, se utiliza en controllers y rutas del backend y en archivos del frontend que requieran guardar sesiones

const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = (user) => {
    const payload = {// Incluye los datos del usuario en el payload
        usuario: user.usuario,
        email: user.email,
        password: user.password,
        id: user.id,
        rol: user.rol
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
};

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'en auth.JwToken 1: Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];// Obtener el token sin el prefijo "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'en auth.JwToken 2: Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;// Asigna todo el objeto decodificado a req.user
        next();
        
    } catch (error) {
        console.error('Error de verificación del token:', error); // borrar
        res.status(401).json({ message: 'en auth.JwToken 3: Token inválido' });
    }

};


module.exports = { generateToken, verifyToken };

