"use strict";
const express = require("express");
const eventosRouter = express.Router();
const EventosDAO = require("../integracion/eventosDAO");
const InscripcionesDAO = require('../integracion/inscripcionesDAO');
const NotificacionesDAO = require('../integracion/notificacionesDAO');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

//para las notificaciones quitar cuando notificacionesDAO
const { db } = require("../config/db");

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
const daoI = new InscripcionesDAO();
const daoN = new NotificacionesDAO();

//TODO refactorizar y hacer middleware
function validarTipoEvento(tipo) {
    const tiposValidos = ['seminario', 'taller', 'conferencia'];
    return tiposValidos.includes(tipo);
}

//Ruta para la búsqueda y renericado paricial de eventos
eventosRouter.get("/", authMiddleware.requireUser, (req, res, next) => {
    const { query, date, location, capacityType, capacity, eventType } = req.query;
    const usuarioId = req.session.currentUser.id;

    daoE.buscarEventos(query, date, location, capacityType, capacity, eventType, (error, eventos) => {
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
                    //Marcar el evento con el estado de usuario apropiado
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
                //Renderizar la vista parcial de eventos       
                res.render("partials/eventos", { eventos: eventosFinales, usuario: req.session.currentUser });
            })
            .catch(err => {
                next(err);
            });
    });
});

//Ruta para la gestion de eventos del organizador
eventosRouter.get("/gestion_eventos", authMiddleware.requireUser, authMiddleware.esOrganizador, (req, res, next) => {
    daoE.getEventos((error, eventos) => {
        if (error) {
            next(error);
        }
        res.render("gestion_eventos", { eventos , usuario: req.session.currentUser});
    });
});

//Ruta de los eventos inscritos de un usuario
eventosRouter.get('/mis-eventos', authMiddleware.requireUser, (req, res, next) => {

    daoE.getEventosOrganizador(req.session.currentUser.id, (error, eventos) => {
        if (error) {
            console.error("Error fetching eventos:", error);
            return next(error);
        }
        res.status(200).json({ eventos });
    });
});

//Ruta para eliminar un evento
eventosRouter.delete("/eliminar/:id", authMiddleware.requireUser, authMiddleware.esOrganizador, (req, res, next) => {
    const eventoId = req.params.id;
    const id_usuario = req.session.currentUser.id;
    daoE.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

        //notificar a los usuarios inscritos que el evento ha sido cancelado
        inscripciones.forEach(inscripcion => {
            const usuarioId = inscripcion.id_usuario;
            const tipo = "CANCELACION_EVENTO";
            const fecha = new Date();

            daoN.insertarNotificacion(usuarioId, tipo, eventoId, fecha, false, (err, insertId) => {
                if (err) {
                    console.error("Error al insertar la notificación de desinscripción:", err);
                }
            });
        });

        daoE.deleteEventoById(eventoId, id_usuario, (error) => {
            if (error) {
                console.error('Error al eliminar evento:', error);
                return res.status(500).send("Error al eliminar el evento.");
            }
            res.status(200).send("Evento eliminado con éxito.");
        });
    });
});

//Ruta para obtener el detalle de un evento
eventosRouter.get('/detalle/:id', authMiddleware.requireUser, (req, res, next) => {
    const eventoId = req.params.id;
    daoE.getEventoById(eventoId, (error, evento) => {
        if (error) {
            next(error);
        }
        res.json({ evento });
    });
});

//Editar evento
eventosRouter.post("/editar/:id", authMiddleware.requireUser, authMiddleware.esOrganizador, fotos.single("foto"), async (req, res, next) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!validarTipoEvento(tipo)) {
        return res.status(400).json({ error: `Tipo de evento inválido: ${tipo}. Debe ser 'seminario', 'taller' o 'conferencia'.` });
    }

    try {
        await daoE.editarEvento({ id, titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, foto }, req.session.currentUser.id);
        res.json({ mensaje: "Evento actualizado correctamente" });
    } catch (error) {
        console.error("Error al editar evento:", error);
        next(error);
    }
});


//Añadir un evento
eventosRouter.post("/anyadir", fotos.single("foto"), async (req, res, next) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo } = req.body;
    const id_organizador = req.session.currentUser.id;
    const foto = req.file ? req.file.filename : "default.jpg";

    //valida entrada de tipo de evento
    if (!validarTipoEvento(tipo)) {
        return res.status(400).json({ error: `Tipo de evento inválido: ${tipo}. Debe ser 'seminario', 'taller' o 'conferencia'.` });
    }

    try {
        const result = await daoE.crearEvento({ titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, id_organizador, foto });
        res.json({ mensaje: "Evento añadido correctamente", resultado: result });
    } catch (error) {
        console.error("Error al añadir evento:", error);
        next(error);
    }
});


module.exports= eventosRouter;