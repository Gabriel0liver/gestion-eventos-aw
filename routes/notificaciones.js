const express = require('express');
const notificacionesRouter = express.Router();
const { db } = require("../config/db");
const authMiddleware = require('../middleware/authMiddleware');

//TODO daonotificaciones
//Obtener notificaciones
notificacionesRouter.get('/', authMiddleware.requireUser, (req, res) => {
    const idUsuario = req.session.currentUser.id;
    const query = "SELECT * FROM Notificaciones WHERE id_usuario = ? ORDER BY fecha DESC";
    db.query(query, [idUsuario], (err, notificaciones) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las notificaciones.' });
        }

        const procesadas = notificaciones.map(notificacion => {
            const {id, tipo, info, fecha, leida } = notificacion;

            switch (tipo) {
                case 'CANCELACION_EVENTO':
                    return procesarCancelacionEvento(info, fecha, leida, id);
                case 'RECORDATORIO_EVENTO':
                    return procesarRecordatorioEvento(info, fecha, leida, id);
                case 'ACTUALIZACION_INSCRIPCION':
                    return procesarActualizacionInscripcion(info, fecha, leida, id);
                case 'CONFIRMACION_INSCRIPCION':
                    return procesarConfirmacionInscripcion(info, fecha, leida, id);
                case 'EXPULSION_EVENTO':
                    return procesarExplusionInscripcion(info, fecha, leida, id);
                case 'ASCENSO_LISTA_ESPERA':
                    return procesarAscensoListaEspera(info, fecha, leida, id);
                case 'DESINSCRIPCION_EVENTO':
                    return procesarDesinscripcion(info, fecha, leida, id);
                    
                    default:
                    return {
                        mensaje: 'Notificación desconocida.',
                        fecha,
                        leida,
                    };
            }
        });
        res.json({ notificaciones: procesadas });
    });
});

function procesarDesinscripcion(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'CANCELACION_EVENTO',
        mensaje: `Te has desinscrito del evento con ID ${info}.`,
        fecha,
        leida,
        id,
    };
}

function procesarAscensoListaEspera(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'CANCELACION_EVENTO',
        mensaje: `Has sido ascendido en la lista de espera del evento con ID ${info}.`,
        fecha,
        leida,
        id,
    };
}

function procesarExplusionInscripcion(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'CANCELACION_EVENTO',
        mensaje: `Has sido expulsado del evento con ID ${info}.`,
        fecha,
        leida,
        id,
    };
}

function procesarCancelacionEvento(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'CANCELACION_EVENTO',
        mensaje: `El evento con ID ${info} ha sido cancelado.`,
        fecha,
        leida,
        id,
    };
}

function procesarRecordatorioEvento(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'RECORDATORIO_EVENTO',
        mensaje: `Recordatorio: tienes un evento próximo con ID ${info}.`,
        fecha,
        leida,
        leida,
        id,
    };
}

function procesarActualizacionInscripcion(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'ACTUALIZACION_INSCRIPCION',
        mensaje: `Tu inscripción para el evento con ID ${info} ha sido actualizada.`,
        fecha,
        leida,
        id,
    };
}

function procesarConfirmacionInscripcion(info, fecha, leida, id) {
    //TODO
    return {
        tipo: 'CONFIRMACION_INSCRIPCION',
        mensaje: `Has sido inscrito exitosamente en el evento con ID ${info}.`,
        fecha,
        leida,
        id,
    };
}

// Obtener las notificaciones del usuario
notificacionesRouter.post('/visto/:id', (req, res) => {
    const { id } = req.params;
    const query = "UPDATE notificaciones SET leida = true WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar la notificación.' });
        }
        
        res.json({ message: 'Notificación marcada como vista.' });
    });
});


module.exports = notificacionesRouter;
