const express = require("express");
const indexRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facultades = require("../config/db").facultades;
const EventosDAO = require("../integracion/eventosDAO");

const daoE = new EventosDAO();

indexRouter.get("/", authMiddleware.requireUser, (req, res, next) => {
    const usuario = req.session.currentUser;
    daoE.getEventos((error, eventos) => {
        if (error) {
            next(error);
        }
        res.render("index", { eventos, usuario });
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