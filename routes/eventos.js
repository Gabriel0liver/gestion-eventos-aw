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

    daoE.getEventosOrganizador(req.session.currentUser.id, (error, eventos) => {
        if (error) {
            console.error("Error fetching eventos:", error);
            return next(error);
        }
        res.status(200).json({ eventos });
    });
});

eventosRouter.delete("/eliminar/:id", authMiddleware.requireUser, authMiddleware.esOrganizador, (req, res, next) => {
    const eventoId = req.params.id;
    const id_usuario = req.session.currentUser.id;
    daoE.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

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

    //Verificar si el usuario está inscrito
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
            daoI.inscribirUsuario(usuarioId, eventoId, (err, inscripcion) => {
                if (err) {
                    next(err);
                }
                const mensaje = `Has sido inscrito exitosamente en el evento con ID ${eventoId}.`;
                const tipo = "CONFIRMACION_INSCRIPCION";
                const fecha = new Date();
                
                daoN.insertarNotificacion(usuarioId, tipo, eventoId, fecha, false, (err, insertId) => {
                    if (err) {
                        console.error("Error al insertar la notificación de desinscripción:", err);
                    }
                });

                evento.inscrito = true;
                evento.estado = 'inscrito';
                res.render("partials/evento", { evento, usuario: req.session.currentUser });
            });
        });
    });
});


//Desinscribir
eventosRouter.post('/desinscribir', authMiddleware.requireUser, (req, res, next) => {
    const { eventoId } = req.body;
    const usuarioId = req.session.currentUser.id;

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
            daoI.desinscribirUsuario(usuarioId, eventoId, (err, result) => {
                if (err) {
                    next(err);
                }
                const info = evento.id;
                const tipo = "DESINSCRIPCION_EVENTO";
                const fecha = new Date();
                daoN.insertarNotificacion(usuarioId, tipo, eventoId, fecha, false, (err, insertId) => {
                    if (err) {
                        console.error("Error al insertar la notificación de desinscripción:", err);
                    }
                });
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

eventosRouter.get('/inscripciones/:eventoId', authMiddleware.requireUser, (req, res, next) => {
    const eventoId = req.params.eventoId;

    daoI.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

        res.json({ inscripciones });
    });
});

eventosRouter.get('/detalle-inscripciones/:eventoId', authMiddleware.requireUser, (req, res, next) => {
    const eventoId = req.params.eventoId;

    daoI.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

        const inscritos = inscripciones.filter(inscripcion => inscripcion.estado === 'inscrito');
        const listaEspera = inscripciones.filter(inscripcion => inscripcion.estado === 'lista_espera');

        res.json({ inscritos, listaEspera });
    });
});

eventosRouter.post('/ascender-inscripcion', authMiddleware.requireUser, (req, res, next) => {
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


eventosRouter.post('/eliminar-inscripcion', authMiddleware.requireUser, (req, res, next) => {
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


eventosRouter.get('/inscripciones/:eventoId', authMiddleware.requireUser, (req, res, next) => {
    const eventoId = req.params.eventoId;

    daoI.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

        res.json({ inscripciones });
    });
});

eventosRouter.get('/detalle-inscripciones/:eventoId', authMiddleware.requireUser, (req, res, next) => {
    const eventoId = req.params.eventoId;

    daoI.getInscripcionesPorEvento(eventoId, (err, inscripciones) => {
        if (err) {
            return next(err);
        }

        const inscritos = inscripciones.filter(inscripcion => inscripcion.estado === 'inscrito');
        const listaEspera = inscripciones.filter(inscripcion => inscripcion.estado === 'lista_espera');

        res.json({ inscritos, listaEspera });
    });
});

eventosRouter.post('/ascender-inscripcion', authMiddleware.requireUser, (req, res, next) => {
    const { inscripcionId } = req.body;

    daoI.getEvento(inscripcionId, (err, evento) => {
        if (err) {
            return next(err);
        }
        daoI.getInscripcionesActivasPorEvento(evento.id, (err, inscripciones) => {
            if (err) {
                return next(err);
            }
            if (inscripciones.length  >= evento.capacidad_maxima) {
                res.status(400).json({ error: 'No se puede ascender la inscripción porque el evento está completo' });
            }else{
                daoI.ascenderInscripcion(inscripcionId, (err) => {
                    if (err) {
                        return next(err);
                    }
                    res.json({ success: true });
                });
            }
        });
    });
});

eventosRouter.post('/eliminar-inscripcion', authMiddleware.requireUser, (req, res, next) => {
    console.log(req.body);
    const { inscripcionId } = req.body;

    console.log(inscripcionId);

    daoI.eliminarInscripcion(inscripcionId, (err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true });
    });
});

module.exports= eventosRouter;