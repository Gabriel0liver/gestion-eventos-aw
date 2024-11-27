"use strict";
const express = require("express");
const eventosRouter = express.Router();
const EventosDAO = require("../integracion/eventosDAO");
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'fotos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const fotos = multer({ storage: storage });


const daoE = new EventosDAO();

eventosRouter.get("/", authMiddleware.requireUser, (req, res) => {
    daoE.getEventos((error, eventos) => {
        if (error) {
            next(error);
        }
        res.render("eventos", { eventos });
    });
});


eventosRouter.get("/gestion_eventos", authMiddleware.requireUser, (req, res) => {
    daoE.getEventos((error, eventos) => {
        if (error) {
            next(error);
        }
        res.render("gestion_eventos", { eventos });
    });
});

eventosRouter.get('/mis-eventos', authMiddleware.requireUser, async (req, res) => {
    try {
        const eventos = await daoE.getEventosOrganizador(1);
        res.json({ eventos });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ error: 'Error al obtener los eventos' });
    }
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
    daoE.deleteEventoById(eventoId, (error) => {
        if (error) {
            console.error('Error al eliminar evento:', error);
            return res.status(500).send("Error al eliminar el evento.");
        }
        res.status(200).send("Evento eliminado con éxito.");
    });
});

eventosRouter.get('/detalle/:id', authMiddleware.requireUser, (req, res) => {
    const eventoId = req.params.id;
    daoE.getEventoById(eventoId, (error, evento) => {
        if (error) {
            console.error('Error al obtener el detalle del evento:', error);
            return res.status(500).json({ error: 'Error al obtener el detalle del evento.' });
        }
        res.json({ evento });
    });
});

//Editar evento
eventosRouter.post('/editar/:id', authMiddleware.requireUser, fotos.single('foto'), async (req, res) => {
    console.log("DDDDDD");
    const { id } = req.params;
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima } = req.body;
    console.log("CCCCCC");
    const foto = req.file ? req.file.filename : null;
    console.log("BBBBBB");
    try {
        await daoE.editarEvento({ id, titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, foto });
        res.json({ mensaje: 'Evento actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar evento:', error);
        res.status(500).json({ error: 'Error al editar el evento' });
    }
});



//Añadir un evento
eventosRouter.post('/anyadir', authMiddleware.requireUser, fotos.single('foto'), async (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima } = req.body;
    const foto = req.file ? req.file.filename : null;
    const id_organizador = req.session.currentUser.id;
    console.log("ID ORGANIZADOR: ", id_organizador);
    try {
        await daoE.crearEvento({ titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima,id_organizador, foto });
        res.json({ mensaje: 'Evento añadido correctamente' });
    } catch (error) {
        console.error('Error al añadir evento:', error);
        res.status(500).json({ error: 'Error al añadir el evento' });
    }
});

module.exports= eventosRouter;