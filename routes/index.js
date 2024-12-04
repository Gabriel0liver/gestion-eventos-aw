const express = require("express");
const indexRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facultades = require("../config/db").facultades;
const EventosDAO = require("../integracion/eventosDAO");
const InscripcionesDAO = require("../integracion/inscripcionesDAO");

const daoE = new EventosDAO();
const daoI = new InscripcionesDAO();

//Pagina principal de la web
indexRouter.get("/", authMiddleware.requireUser, (req, res, next) => {
    const usuario = req.session.currentUser;
    const usuarioId = usuario.id;

    daoE.getEventos((error, eventos) => {
        if (error) {
            return next(error);
        }

        //Verificar la inscripción de eventos
        const eventosConInscripcion = eventos.map(evento => {
            return new Promise((resolve, reject) => {
                //Verificar la inscripción de  usuario
                daoI.getInscripcion(usuarioId, evento.id, (err, inscripcion) => {
                    if (err) {
                        reject(err);
                    }
                    //Marcar estado de inscripción del usuario
                    evento.inscrito = inscripcion ? true : false;
                    if (evento.inscrito) {
                        evento.estado = inscripcion.estado;
                    }
                    resolve(evento);
                });
            });
        });

        //Renderizar la página principal despues de marcar las inscripciones
        Promise.all(eventosConInscripcion)
            .then(eventosFinales => {               
                res.render("index", { eventos: eventosFinales, usuario });
            })
            .catch(err => {
                next(err);
            });
    });
});

//Pagina de login
indexRouter.get("/login", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("login")}
);

//Pagina de registro
indexRouter.get("/register", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("register",{facultades})}
);

//Pagina de recuperar contraseña
indexRouter.get("/recuperar", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("recuperar")}
);

module.exports= indexRouter;