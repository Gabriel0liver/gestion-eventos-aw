const express = require("express");
const indexRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facultades = require("../config/db").facultades;
const EventosDAO = require("../integracion/eventosDAO");
const InscripcionesDAO = require("../integracion/inscripcionesDAO");

const daoE = new EventosDAO();
const daoI = new InscripcionesDAO();

//Cutrez luego lo cambio
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
                    evento.inscrito = inscripcion ? true : false;
                    if (evento.inscrito) {
                        evento.estado = inscripcion.estado;
                    }
                    resolve(evento);
                });
            });
        });

        Promise.all(eventosConInscripcion)
            .then(eventosFinales => {               
                res.render("index", { eventos: eventosFinales, usuario });
            })
            .catch(err => {
                next(err);
            });
    });
});

indexRouter.get("/login", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("login")}
);

indexRouter.get("/register", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("register",{facultades})}
);

indexRouter.get("/recuperar", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("recuperar")}
);

module.exports= indexRouter;