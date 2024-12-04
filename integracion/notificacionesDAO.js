"use strict";

const { db } = require("../config/db");

class NotificacionesDAO {

    getNotificacionesByUsuario(idUsuario, callback) {
        const query = "SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY fecha DESC";
        db.query(query, [idUsuario], (err, rows) => {
            if (err) callback(new Error(err));
            else callback(null, rows);
        });
    }

    marcarComoVista(idNotificacion, callback) {
        const query = "UPDATE notificaciones SET leida = true WHERE id = ?";
        db.query(query, [idNotificacion], (err, result) => {
            if (err) callback(new Error(err));
            else callback(null, result.affectedRows > 0);
        });
    }

    insertarNotificacion(id_usuario, tipo, info, fecha, leida, callback) {
        const query = "INSERT INTO notificaciones (id_usuario, tipo, info, fecha, leida) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [id_usuario, tipo, info, fecha, leida], (err, result) => {
            if (err) {
                callback(new Error(err));
            } else {
                callback(null, result.insertId);
            }
        });
    }

    eliminarNotificacion(idNotificacion, callback) {
        const query = "DELETE FROM notificaciones WHERE id = ?";
        db.query(query, [idNotificacion], (err, result) => {
            if (err) callback(new Error(err));
            else callback(null, result.affectedRows > 0);
        });
    }

    getNotificacionById(idNotificacion, callback) {
        const query = "SELECT * FROM notificaciones WHERE id = ?";
        db.query(query, [idNotificacion], (err, rows) => {
            if (err) callback(new Error(err));
            else callback(null, rows[0] || null);
        });
    }
}

module.exports = NotificacionesDAO;
