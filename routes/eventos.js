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

eventosRouter.post("/inscribirse/:id", (req, res) => {
    const eventoId = req.params.id;
    const usuarioId = 1;

    const sql = "INSERT INTO inscripciones (id_usuario, id_evento) VALUES (?, ?)";
    db.query(sql, [usuarioId, eventoId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al inscribirse al evento.");
        }
        res.status(200).send("Inscripción realizada con éxito.");
    });
});

eventosRouter.delete("/eliminar/:id", (req, res) => {
    const eventoId = req.params.id;

    const sql = "DELETE FROM eventos WHERE id = ?";
    db.query(sql, [eventoId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al eliminar el evento.");
        }
        res.status(200).send("Evento eliminado con éxito.");
    });
});


module.exports= eventosRouter;