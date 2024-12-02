'use strict';

const authMiddleware = {};

authMiddleware.requireAnon = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

authMiddleware.requireUser = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  next();
};

authMiddleware.esAsistente = (req, res, next) => {
    if(req.session.currentUser.rol !== 'asistente'){
        return res.redirect('/');
    }
    next();
}

authMiddleware.esOrganizador = (req, res, next) => {
    if(req.session.currentUser.rol !== 'organizador'){
        return res.redirect('/');
    }
    next();
}

authMiddleware.checkRegister = (req, res, next) => {
    if(!req.body.nombre || !req.body.correo || !req.body.contrasena){
        res.status(200);
        res.render("register",
            { errorMsg: "El nombre, correo y contraseña son obligatorios"});
        return;
    }
    if(!req.body.facultad || !req.body.rol){
        res.status(200);
        res.render("register",
            { errorMsg: "La facultad y el rol son obligatorios"});
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.correo)) {
        res.status(200);
        res.render("register", { errorMsg: "El correo no es válido" });
        return;
    }
    
    if(req.body.telefono){
        const phoneRegex = /^(\+\d{1,3})?\d{9}$/;
        if (!phoneRegex.test(req.body.telefono)) {
            res.status(200);
            res.render("register", { errorMsg: "El teléfono no es válido" });
            return;
        }
    }
    next();
}

module.exports = authMiddleware;