"use strict";
const express = require("express");
const inscripcionesRouter = express.Router();
const EventosDAO = require("../integracion/eventosDAO");
const InscripcionesDAO = require('../integracion/inscripcionesDAO');
const NotificacionesDAO = require('../integracion/notificacionesDAO');
const authMiddleware = require('../middleware/authMiddleware');

const daoE = new EventosDAO();
const daoI = new InscripcionesDAO();
const daoN = new NotificacionesDAO();

const { db } = require("../config/db");


//Inscribirse
inscripcionesRouter.post('/inscribir', authMiddleware.requireUser, (req, res, next) => {
    const { eventoId } = req.body;
    const usuarioId = req.session.currentUser.id;

    //Verificar si el usuario ya está inscrito
    daoI.getInscripcion(usuarioId, eventoId, (err, inscrito) => {
        if (err) {
            next(err);
        }
        //Si ya está inscrito, devolver error
        if (inscrito) {
            return res.status(400).json({ error: 'Ya estás inscrito en este evento' });
        }

        daoE.getEventoById(eventoId, (err, evento) => {
            if (err) {
                next(err);
            }
            daoE.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
                if (err) {
                    next(err);
                }
                //Si el evento está completo, inscribir en lista de espera
                if (inscripciones.length >= evento.capacidad_maxima) {
                    daoI.esperaUsuario(usuarioId, eventoId, (err, inscripcion) => {
                        if (err) {
                            next(err);
                        }
                        const mensaje = `Has sido inscrito en la lista de espera del evento con ID ${eventoId}.`;
                        const tipo = "EN_LISTA_ESPERA";
                        const fecha = new Date();
                        //Notificar al usuario que está en lista de espera
                        daoN.insertarNotificacion(usuarioId, tipo, evento.titulo, fecha, false, (err, insertId) => {
                            if (err) {
                                next(err);
                            }
                        });

                        console.log("Inscrito en lista de espera");
                        evento.inscrito = true;
                        evento.estado = 'lista_espera';
                        //Renderizar la vista del evento con nuevo estado
                        res.render("partials/evento", { evento, usuario: req.session.currentUser });
                    });
                }else{
                    //Si hay espacio, inscribir directamente
                    daoI.inscribirUsuario(usuarioId, eventoId, (err, inscripcion) => {
                        if (err) {
                            next(err);
                        }
                        const mensaje = `Has sido inscrito exitosamente en el evento con ID ${eventoId}.`;
                        const tipo = "CONFIRMACION_INSCRIPCION";
                        const fecha = new Date();
                        
                        //Notificar al usuario que se ha inscrito
                        daoN.insertarNotificacion(usuarioId, tipo, evento.titulo, fecha, false, (err, insertId) => {
                            if (err) {
                                next(err);
                            }
                        });

                        evento.inscrito = true;
                        evento.estado = 'inscrito';
                        //Renderizar la vista del evento con nuevo estado
                        res.render("partials/evento", { evento, usuario: req.session.currentUser });
                    });
                }
                
            });
        });
    });
});


//Desinscribir
inscripcionesRouter.post('/desinscribir', authMiddleware.requireUser, (req, res, next) => {
    const { eventoId } = req.body;
    const usuarioId = req.session.currentUser.id;

    daoI.getInscripcion(usuarioId, eventoId, (err, inscrito) => {
        if (err) {
            next(err);
        }
        //Si no está inscrito, devolver error
        if (!inscrito) {
            console.log("No estás inscrito en este evento");
            return res.status(400).json({ error: 'No estás inscrito en este evento' });
        }

        daoE.getEventoById(eventoId, (err, evento) => {
            if (err) {
                next(err);
            }
            daoI.desinscribirUsuario(usuarioId, eventoId, (err, result) => {
                if (err) {
                    next(err);
                }
                const info = evento.id;
                const tipo = "DESINSCRIPCION_EVENTO";
                const fecha = new Date();
                //Notificar al usuario que se ha desinscrito
                daoN.insertarNotificacion(usuarioId, tipo, evento.titulo, fecha, false, (err, insertId) => {
                    if (err) {
                        next(err);
                    }
                });
                evento.inscrito = false;
                res.render("partials/evento", { evento, usuario: req.session.currentUser });
            });
        });
    });
});


//Mostrar las inscripciones de un usuario
inscripcionesRouter.get("/mis-inscripciones", authMiddleware.requireUser, (req, res, next) => {
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


inscripcionesRouter.get('/lista/:eventoId', authMiddleware.requireUser, (req, res, next) => {
    const eventoId = req.params.eventoId;

    daoI.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

        res.json({ inscripciones });
    });
});

inscripcionesRouter.post('/ascender', authMiddleware.requireUser, (req, res, next) => {
    const { inscripcionId } = req.body;

    daoI.getEvento(inscripcionId, (err, evento) => {
        if (err) {
            return next(err);
        }
        daoI.getInscripcionesActivasPorEvento(evento.id, (err, inscripciones) => {
            if (err) {
                return next(err);
            }
            if (inscripciones.length >= evento.capacidad_maxima) {
                res.status(400).json({ error: 'No se puede ascender la inscripción porque el evento está completo' });
            } else {
                daoI.ascenderInscripcion(inscripcionId, (err, usuarioId) => {
                    if (err) {
                        return next(err);
                    }

                    //Notificación
                    const tipo = "ASCENSO_LISTA_ESPERA";
                    const fecha = new Date();
                    const query = `INSERT INTO Notificaciones (id_usuario, tipo, info, fecha, leida) VALUES (?, ?, ?, ?, false)`;
                    db.query(query, [usuarioId, tipo, `Has sido ascendido al evento ${evento.titulo}.`, fecha], (err) => {
                        if (err) {
                            console.error("Error al insertar notificación:", err);
                        }
                    });

                    res.json({ success: true });
                });
            }
        });
    });
});


inscripcionesRouter.post('/eliminar', authMiddleware.requireUser, (req, res, next) => {
    const { inscripcionId } = req.body;

    daoI.eliminarInscripcion(inscripcionId, (err, usuarioId) => {
        if (err) {
            return next(err);
        }
        console.log("Se elimina")
        //Notificación
        const tipo = "EXPULSION_EVENTO";
        const fecha = new Date();
        const query = `INSERT INTO Notificaciones (id_usuario, tipo, info, fecha, leida) VALUES (?, ?, ?, ?, false)`;
        db.query(query, [usuarioId, tipo, `Tu inscripción en el evento ha sido eliminada.`, fecha], (err) => {
            if (err) {
                console.error("Error al insertar notificación:", err);
            }
        });

        res.json({ success: true });
    });
});



module.exports= inscripcionesRouter;