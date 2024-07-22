const { generateToken, verifyToken } = require('./auth.JwToken');
const checkRol = require('./checkRol');


module.exports = { 
    generateToken, 
    verifyToken, 
    checkRol 
};

