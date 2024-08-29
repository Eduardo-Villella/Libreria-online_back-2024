    function checkRol(requireRol) {// Al llamar la funcion en las rutas debemos darle el rol que deseamos (Administrador o Cliente) segun sea el caso. // Devuelve una funcion middleware
        
        return function middlewareRol(req, res, next) {// Esta funcion puede ser anonima, es decir no necesita el nombre: middlewareRol ni ningun otro, si asi lo prefiere.
            if (req.user.rol === requireRol) {
                next();// Pasa al siguiente middleware si el rol coincide

            } else {
                res.status(403).json({ message: 'en checkRol: Acceso denegado: No tienes el rol adecuado' });
            }
        };

    }

    /* -------------------- */

    async function isAdmin(req = request, res = response) {
        try {
            const { email } = req.user; // Obtengo el email del usuario del token
            const user = await this.model.findByEmail(email); // Busco al usuario en la base de datos
    
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            if (user.rol === 'Administrador') {
                return res.status(200).json({ isAdmin: true });
            } else {
                return res.status(200).json({ isAdmin: false });
            }
    
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar el rol de administrador', error: error.message });
        }

    }


module.exports = { checkRol, isAdmin }; // Exporta ambas funciones

/* El siguiente metodo cumple la misma funcion que la primera */
/* Definimos y exportamos una funcion de orden superior (higher-order function) que toma un parametro requiredRol.
Este parametro representa el rol necesario para acceder a una ruta especifica y devuelve una funcion middleware que toma
los parametros req (request), res (response) y next.  

module.exports = (requireRol) => {
    return (req, res, next) => {
        if (req.user.rol === requireRol) {
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado: No tienes el rol adecuado' });
        }
    };
};

No necesitan importar nada para su funcionamiento y en el caso de la segunda, que es totalmente anonima, se usa en la ruta
con el nombre del archivo en el que se definio (en este caso: checkRol) y este debe ser importado en el archivo donde se usara.
Esta ultima tampoco necesita de exportacion extra ya que en la definicion exporta: module.exports = ... */

