const express = require('express');
const notificacionesRouter = express.Router();
const { db } = require("../config/db");
const authMiddleware = require('../middleware/authMiddleware');

//Obtener notificaciones
notificacionesRouter.get('/', authMiddleware.requireUser, (req, res) => {
    const idUsuario = req.session.currentUser.id;
    const query = "SELECT * FROM Notificaciones WHERE id_usuario = ? ORDER BY fecha DESC";
    db.query(query, [idUsuario], (err, notificaciones) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las notificaciones.' });
        }

        const procesadas = notificaciones.map(notificacion => {
            const { tipo, info, fecha } = notificacion;

            switch (tipo) {
                case 'CANCELACION_EVENTO':
                    return procesarCancelacionEvento(info, fecha);
                case 'RECORDATORIO_EVENTO':
                    return procesarRecordatorioEvento(info, fecha);
                case 'ACTUALIZACION_INSCRIPCION':
                    return procesarActualizacionInscripcion(info, fecha);
                case 'CONFIRMACION_INSCRIPCION':
                    return procesarConfirmacionInscripcion(info, fecha);
                default:
                    return {
                        mensaje: 'Notificación desconocida.',
                        fecha,
                    };
            }
        });
        console.log(procesadas);
        res.json({ notificaciones: procesadas });
    });
});


function procesarCancelacionEvento(info, fecha) {
    //TODO
    return {
        tipo: 'CANCELACION_EVENTO',
        mensaje: `El evento con ID ${info} ha sido cancelado.`,
        fecha,
    };
}

function procesarRecordatorioEvento(info, fecha) {
    //TODO
    return {
        tipo: 'RECORDATORIO_EVENTO',
        mensaje: `Recordatorio: tienes un evento próximo con ID ${info}.`,
        fecha,
    };
}

function procesarActualizacionInscripcion(info, fecha) {
    //TODO
    return {
        tipo: 'ACTUALIZACION_INSCRIPCION',
        mensaje: `Tu inscripción para el evento con ID ${info} ha sido actualizada.`,
        fecha,
    };
}

function procesarConfirmacionInscripcion(info, fecha) {
    //TODO
    return {
        tipo: 'CONFIRMACION_INSCRIPCION',
        mensaje: `Has sido inscrito exitosamente en el evento con ID ${info}.`,
        fecha,
    };
}

// Obtener las notificaciones del usuario
notificacionesRouter.post('/visto/:id', (req, res) => {
    const { id } = req.params;

    const query = "UPDATE Notificaciones SET leida = true WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar la notificación.' });
        }

        res.json({ message: 'Notificación marcada como vista.' });
    });
});


module.exports = notificacionesRouter;
