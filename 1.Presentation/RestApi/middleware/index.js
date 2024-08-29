const { generateToken, verifyToken } = require('./auth.JwToken');
const { checkRol, isAdmin } = require('./checkRol');
const verifyCredentials = require('./verifyCredentials');
const upload = require('./multer.config');

module.exports = { 
    generateToken,
    verifyToken,
    checkRol,
    isAdmin,
    verifyCredentials,
    upload
};

