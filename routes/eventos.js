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
                res.render("partials/eventos", { eventos: eventosFinales, usuario: req.session.currentUser });
            })
            .catch(err => {
                next(err);
            });
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

/*
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
eventosRouter.post('/inscribir', authMiddleware.requireUser, (req, res, next) => {
    const { eventoId } = req.body;
    const usuarioId = req.session.currentUser.id;

    // Verificar si el usuario ya está inscrito
    daoI.getInscripcion(usuarioId, eventoId, (err, inscrito) => {
        if (err) {
            next(err);
        }
        if (inscrito) {
            return res.status(400).json({ error: 'Ya estás inscrito en este evento' });
        }

        daoE.getEventoById(eventoId, (err, evento) => {
            if (err) {
                next(err);
            }
            daoI.getInscripccionesPorEvento(eventoId, (err, inscripciones) => {
                if (err) {
                    next(err);
                }
                if (inscripciones.length >= evento.capacidad_maxima) {
                    daoI.esperaUsuario(usuarioId, eventoId, (err, inscripcion) => {
                        if (err) {
                            next(err);
                        }
                        evento.inscrito = true;
                        evento.estado = 'lista_espera';
                        res.render("partials/evento", { evento, usuario: req.session.currentUser });
                    });
                    return;
                }
                daoI.inscribirUsuario(usuarioId, eventoId, (err, inscripcion) => {
                    if (err) {
                        next(err);
                    }
                    evento.inscrito = true;
                    evento.estado = 'inscrito';
                    res.render("partials/evento", { evento, usuario: req.session.currentUser });
                });
            } );
        });
    });
});

//Desinscribir
eventosRouter.post('/desinscribir', authMiddleware.requireUser, (req, res, next) => {
    const { eventoId  } = req.body;
    const usuarioId = req.session.currentUser.id;

    // Verificar si el usuario está inscrito
    daoI.getInscripcion(usuarioId, eventoId, (err, inscrito) => {
        if (err) {
            next(err);
        }
        if (!inscrito) {
            console.log("No estás inscrito en este evento");
            return res.status(400).json({ error: 'No estás inscrito en este evento' });
        }

        daoE.getEventoById(eventoId, (err, evento) => {
            if (err) {
                next(err);
            }
            // Eliminar la inscripción
            daoI.desinscribirUsuario(usuarioId, eventoId, (err, result) => {
                if (err) {
                    next(err);
                }
                evento.inscrito = false;
                res.render("partials/evento", { evento, usuario: req.session.currentUser });
            });
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
                    evento.inscrito = true;
                    evento.estado = inscripcion.estado;
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