"use strict";

const { db } = require("../config/db");

class InscripcionesDAO {

    // Obtener inscripción por usuario y evento
    getInscripcion(usuarioId, eventoId, callback) {
        const sql = 'SELECT * FROM inscripciones WHERE id_usuario = ? AND id_evento = ?';
        db.query(sql, [usuarioId, eventoId], (err, rows) => {
            if (err) {
                console.error('Error en la consulta de inscripción:', err); 
                return callback(err, null);
            }
            callback(null, rows[0]);
        });
    }

    // Obtener inscripciones por evento
    getInscripccionesPorEvento(eventoId, callback) {
        const sql = 'SELECT * FROM inscripciones WHERE id_evento = ?';
        db.query(sql, [eventoId], (err, rows) => {
            if (err) {
                console.error('Error en la consulta de inscripción:', err); 
                return callback(err, null);
            }
            callback(null, rows);
        });
    }


    // Inscribir a un usuario en un evento
    inscribirUsuario(usuarioId, eventoId, callback) {
        const sql = 'INSERT INTO inscripciones (id_usuario, id_evento, estado, fecha_inscripcion) VALUES (?, ?, "inscrito", NOW())';
        db.query(sql, [usuarioId, eventoId], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id_usuario: usuarioId, id_evento: eventoId, estado: 'inscrito' });
        });
    }

    // Inscribir a un usuario en un evento
    esperaUsuario(usuarioId, eventoId, callback) {
        const sql = 'INSERT INTO inscripciones (id_usuario, id_evento, estado, fecha_inscripcion) VALUES (?, ?, "lista_espera", NOW())';
        db.query(sql, [usuarioId, eventoId], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id_usuario: usuarioId, id_evento: eventoId, estado: 'inscrito' });
        });
    }

    // Desinscribir a un usuario de un evento
    desinscribirUsuario(usuarioId, eventoId, callback) {
        const sql = 'DELETE FROM inscripciones WHERE id_usuario = ? AND id_evento = ?';
        db.query(sql, [usuarioId, eventoId], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { success: 'Desinscripción realizada con éxito' });
        });
    }

    //Obtener las inscripciones de un usuario
    getMisInscripciones(usuarioId, callback) {
        const sql = 'SELECT * FROM inscripciones WHERE id_usuario = ?';
        db.query(sql, [usuarioId], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, rows);
        });
    }

    //Obtener el historial de las inscripciones de un usuario
    getHistorialEventosUsuario(usuarioId, callback) {
        const sql = `
            SELECT e.titulo, e.fecha, i.estado
            FROM inscripciones i
            JOIN eventos e ON i.id_evento = e.id
            WHERE i.id_usuario = ?
            ORDER BY e.fecha DESC
        `;
        db.query(sql, [usuarioId], (err, rows) => {
            if (err) {
                console.error('Error en la consulta del historial de eventos:', err); 
                return callback(err, null);
            }
            callback(null, rows);
        });
    }


    //Obtener las inscripciones de un evento
    getInscripcionesPorEvento(eventoId, callback) {
        const sql = 'SELECT i.id, i.id_usuario, i.estado, u.nombre FROM inscripciones i JOIN usuarios u ON i.id_usuario = u.id WHERE i.id_evento = ?';
        db.query(sql, [eventoId], (err, rows) => {
            if (err) {
                console.error('Error en la consulta de inscripciones:', err); 
                return callback(err, null);
            }
            callback(null, rows);
        });
    }

    //Asciende una inscripción de lista de espera a inscrito
    ascenderInscripcion(inscripcionId, callback) {
        const sql = 'UPDATE inscripciones SET estado = "inscrito" WHERE id = ?';
        db.query(sql, [inscripcionId], (err, result) => {
            if (err) {
                console.error('Error al ascender inscripción:', err); 
                return callback(err, null);
            }
            callback(null, result);
        });
    }

    //Eliminar una inscripción
    eliminarInscripcion(inscripcionId, callback) {
        const sql = 'DELETE FROM inscripciones WHERE id = ?';
        db.query(sql, [inscripcionId], (err, result) => {
            if (err) {
                console.error('Error al eliminar inscripción:', err); 
                return callback(err, null);
            }
            callback(null, result);
        });
    }

    //Obtener el evento de una inscripción
    getEvento(inscripcionId, callback) {
        const sql = 'SELECT e.* FROM inscripciones i JOIN eventos e ON i.id_evento = e.id WHERE i.id = ?';
        db.query(sql, [inscripcionId], (err, rows) => {
            if (err) {
                console.error('Error en la consulta de evento:', err); 
                return callback(err, null);
            }
            callback(null, rows[0]);
        });
    }

    //Obtener las inscripciones activas de un evento
    getInscripcionesActivasPorEvento(eventoId, callback) {
        const sql = 'SELECT * FROM inscripciones WHERE id_evento = ? AND estado = "inscrito"';
        db.query(sql, [eventoId], (err, rows) => {
            if (err) {
                console.error('Error en la consulta de inscripción:', err); 
                return callback(err, null);
            }
            callback(null, rows);
        });
    }

}

module.exports = InscripcionesDAO;
