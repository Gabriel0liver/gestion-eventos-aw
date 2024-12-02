"use strict";

const { db } = require("../config/db");

class EventosDAO {

    getEventos(callback){
        db.query("SELECT * FROM eventos", function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows)
            }
        })
    }

    getEventosOrganizador(idOrganizador) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM eventos WHERE id_organizador = ?";
            db.query(sql, [idOrganizador], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    getEventosUsuario(id_usuario, callback){
        db.query("SELECT * FROM inscripciones WHERE id_evento = ? AND id_usuario = ?", [id_evento, id_usuario], function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows)
            }
        })
    }

    insertEvento(evento, callback){
        db.query("INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, id_organizador) values(?,?,?,?,?,?,?,?)",
        [evento.titulo, evento.descripcion, evento.fecha, evento.hora, evento.ubicacion, evento.capacidad_maxima, evento.tipo, evento.id_organizador ], (e, rows) =>{
            c.release()
            if (e) callback(new Error(e));
            else callback(null,evento);
        });
              
    }

    deleteEvento(evento, callback){
        db.query("DELETE FROM eventos WHERE Id = ?", [evento.Id], (e, rows) =>{
            c.release()
            if (e) callback(new Error(e));
            else callback(null,evento);
        });    
    }

    getEventoById(id, callback) {
        db.query("SELECT * FROM eventos WHERE id = ?", [id], function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows[0]);
            }
        });
    }
    
    deleteEventoById(id, callback) {
        db.query("DELETE FROM eventos WHERE id = ?", [id], (e) => {
            if (e) callback(new Error(e));
            else callback(null);
        });
    }

    editarEvento(eventoData) {
        console.log("AAAAAA");
        return new Promise((resolve, reject) => {
            const sql = ` UPDATE eventos
                SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, ubicacion = ?, capacidad_maxima = ?, foto = ?
                WHERE id = ?`;
            const { id, titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, foto } = eventoData;
            db.query(sql, [titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, foto, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
    
    
    crearEvento(eventoData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima,id_organizador, foto)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima,id_organizador, foto } = eventoData;
            db.query(sql, [titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima,id_organizador, foto], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
    
    
    buscarEventos(query, date, location, capacityType, capacity, eventType, callback) {
        let sql = 'SELECT * FROM eventos WHERE 1=1';
        const params = [];

        if (query) {
            sql += ' AND titulo LIKE ?';
            params.push(`%${query}%`);
        }
        if (date) {
            sql += ' AND fecha = ?';
            params.push(date);
        }
        if (location) {
            sql += ' AND ubicacion LIKE ?';
            params.push(`%${location}%`);
        }
        if (capacity) {
            if (capacityType === 'greater') {
                sql += ' AND capacidad_maxima >= ?';
            } else {
                sql += ' AND capacidad_maxima <= ?';
            }
            params.push(capacity);
        }
        if (eventType) {
            sql += ' AND tipo = ?';
            params.push(eventType);
        }

        db.query(sql, params, (err, rows) => {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    }
}

module.exports = EventosDAO;