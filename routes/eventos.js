"use strict";
const express = require("express");
const eventosRouter = express.Router();
const EventosDAO = require("../integracion/eventosDAO");
const InscripcionesDAO = require('../integracion/inscripcionesDAO');
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
const daoI = new InscripcionesDAO();

//TODO refactorizar y hacer middleware
function validarTipoEvento(tipo) {
    const tiposValidos = ['seminario', 'taller', 'conferencia'];
    return tiposValidos.includes(tipo);
}

eventosRouter.get("/", authMiddleware.requireUser, (req, res, next) => {
    const { query, date, location, capacityType, capacity, eventType } = req.query;

    daoE.buscarEventos(query, date, location, capacityType, capacity, eventType, (error, eventos) => {
        if (error) {
            return next(error);
        }
        res.render("partials/eventos", { eventos: eventos, usuario: req.session.currentUser });
    });
});

eventosRouter.get("/gestion_eventos", authMiddleware.requireUser, authMiddleware.esOrganizador, (req, res, next) => {
    daoE.getEventos((error, eventos) => {
        if (error) {
            next(error);
        }
        res.render("gestion_eventos", { eventos , usuario: req.session.currentUser});
    });
});

eventosRouter.get('/mis-eventos', authMiddleware.requireUser, (req, res, next) => {
    daoE.getEventosOrganizador(1, (error, eventos) => {
        if (error) {
            console.error("Error fetching eventos:", error);
            return next(error);
        }

        if (!eventos || eventos.length === 0) {
            console.warn("No se encontraron eventos para el organizador.");
            return res.status(404).json({ mensaje: "No se encontraron eventos." });
        }
        res.json({ eventos });
    });
});

/* POR ELIMINAR
eventosRouter.get("/crear", authMiddleware.requireUser, (req, res, next) => {
    res.render("formularioEvento", { usuario: req.session.currentUser});
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
                    next(error);
                }
                res.redirect("/eventos");
            });
        }
    });
});
*/



eventosRouter.delete("/eliminar/:id", authMiddleware.requireUser, authMiddleware.esOrganizador, (req, res, next) => {
    const eventoId = req.params.id;
    daoE.deleteEventoById(eventoId, (error) => {
        if (error) {
            console.error('Error al eliminar evento:', error);
            return res.status(500).send("Error al eliminar el evento.");
        }
        res.status(200).send("Evento eliminado con éxito.");
    });
});

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
        await daoE.editarEvento({ id, titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, foto });
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



//TODO: Separar a otro js de inscripciones si hay tiempo
//------------INSCRIPCIONES---------------\\

//Inscribirse
eventosRouter.post('/inscribir', authMiddleware.requireUser, (req, res) => {
    const { eventoId, usuarioId } = req.body;

    // Verificar si el usuario ya está inscrito
    daoI.getInscripcion(usuarioId, eventoId, (err, inscrito) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar inscripción' });
        }
        if (inscrito) {
            return res.status(400).json({ error: 'Ya estás inscrito en este evento' });
        }

        // Realizar la inscripción
        daoI.inscribirUsuario(usuarioId, eventoId, (err, inscripcion) => {
            if (err) {
                return res.status(500).json({ error: 'Error al inscribirse en el evento' });
            }
            res.json(inscripcion);
        });
    });
});

//Desinscribir
eventosRouter.post('/desinscribir', authMiddleware.requireUser, (req, res) => {
    const { eventoId, usuarioId } = req.body;

    // Verificar si el usuario está inscrito
    daoI.getInscripcion(usuarioId, eventoId, (err, inscrito) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar inscripción' });
        }
        if (!inscrito) {
            return res.status(400).json({ error: 'No estás inscrito en este evento' });
        }

        // Eliminar la inscripción
        daoI.desinscribirUsuario(usuarioId, eventoId, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al desinscribirse del evento' });
            }
            res.json(result);
        });
    });
});

//Mostrar las inscripciones de un usuario
eventosRouter.get("/mis-inscripciones", authMiddleware.requireUser, (req, res, next) => {
    const usuarioId = req.session.currentUser.id;

    //Obtener las inscripciones del usuario
    daoI.getMisInscripciones(usuarioId, (error, inscripciones) => {
        if (error) {
            return next(error);
        }

        //Obtener los eventos
        const eventos = inscripciones.map(inscripcion => {
            return new Promise((resolve, reject) => {
                daoE.getEventoById(inscripcion.id_evento, (err, evento) => {
                    if (err) {
                        reject(err);
                    }
                    evento.inscripcionId = inscripcion.id;
                    resolve(evento);
                });
            });
        });

        Promise.all(eventos)
            .then(eventosInscritos => {
                res.render("mis-inscripciones", { eventos: eventosInscritos, usuario: req.session.currentUser });
            })
            .catch(err => {
                next(err);
            });
    });
});


module.exports= eventosRouter;