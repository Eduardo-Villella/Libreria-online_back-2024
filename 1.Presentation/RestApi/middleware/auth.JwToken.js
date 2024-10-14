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
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1]; // Obtener el token sin el prefijo "Bearer"

    if (!token) {
        return res.status(400).json({ message: 'Acceso denegado. Token no válido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Asigna todo el objeto decodificado a req.user
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Sesión expirada. Por favor, inicie sesión nuevamente.' });
        } else {
            return res.status(500).json({ message: 'Error en la verificación del token.', error });
        }
    }
};


module.exports = { generateToken, verifyToken };

