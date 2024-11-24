"use strict";
const express = require("express");
const eventosRouter = express.Router();
const EventosDAO = require("../models/eventosDAO");
const authMiddleware = require('../middleware/authMiddleware');

const daoE = new EventosDAO();

eventosRouter.get("/", authMiddleware.requireUser, (req, res) => {
    daoE.getEventos((error, eventos) => {
        if (error) {
            next(error);
        }
        res.render("eventos", { eventos });
    });
});

eventosRouter.get("/crear", authMiddleware.requireUser, (req, res) => {
    res.render("formularioEvento");
});

eventosRouter.post("/crear", authMiddleware.requireUser, (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo } = req.body;

    const id_organizador = req.session.currentUser.id;

    //Verificar si el organizador es válido
    daoE.verifyOrganizador(id_organizador, (error, esOrganizador) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error al crear el evento.");
        }   
        if (!esOrganizador) {
            return res.status(403).send("No tienes permisos para crear eventos.");
        }else{
            const evento = { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, id_organizador };
            daoE.insertEvento(evento, (error, evento) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Error al crear el evento.");
                }
                res.redirect("/eventos");
            });
        }
    });
});


module.exports= eventosRouter;