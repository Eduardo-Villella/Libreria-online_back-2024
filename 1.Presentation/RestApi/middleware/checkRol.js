function checkRol(requireRol) {// Al llamar la funcion en las rutas debemos darle el rol que deseamos (Administrador o Cliente) segun sea el caso. // Devuelve una funcion middleware
    
    return function middlewareRol(req, res, next) {// Esta funcion puede ser anonima, es decir no necesita el nombre: middlewareRol ni ningun otro, si asi lo prefiere.
        if (req.user.rol === requireRol) {
            next();// Pasa al siguiente middleware si el rol coincide

        } else {
            res.status(403).json({ message: 'Acceso denegado: No tienes el rol adecuado' });
        }
    };

}


module.exports = checkRol;


/* El siguiente metodo cumple la misma funcion que la anterior */
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

