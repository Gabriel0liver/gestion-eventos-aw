"use strict";

const { db } = require("../config/db");

//TODO refactorizar y hacer middleware
function validarTipoEvento(tipo) {
    const tiposValidos = ['seminario', 'taller', 'conferencia'];
    return tiposValidos.includes(tipo);
}

class EventosDAO {

    getEventos(callback){
        db.query("SELECT * FROM eventos", function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows)
            }
        })
    }

    getEventosOrganizador(idOrganizador, callback) {
        const sql = 'SELECT * FROM eventos WHERE id_organizador = ?';
        db.query(sql, [idOrganizador], (error, resultados) => {
            if (error) {
                console.error("Error en la base de datos:", error);
                return callback(error, null);
            }
            callback(null, resultados);
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

    editarEvento(evento) {
        return new Promise((resolve, reject) => {
            const { id, titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, foto } = evento;
    
            if (!validarTipoEvento(tipo)) {
                return reject(new Error(`Tipo de evento inválido: ${tipo}. Debe ser 'seminario', 'taller' o 'conferencia'.`));
            }
    
            const sql = `
                UPDATE eventos 
                SET titulo = ?, descripcion = ?, fecha = ?, hora = ?, ubicacion = ?, capacidad_maxima = ?, tipo = ?, foto = COALESCE(?, foto) 
                WHERE id = ?
            `;
    
            db.query(sql, [titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, foto, id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
    
    
    crearEvento(evento) {
        return new Promise((resolve, reject) => {
            const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, id_organizador, foto } = evento;
    
            if (!validarTipoEvento(tipo)) {
                return reject(new Error(`Tipo de evento inválido: ${tipo}. Debe ser 'seminario', 'taller' o 'conferencia'.`));
            }
    
            const sql = `
                INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, id_organizador, foto) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
    
            db.query(sql, [titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo, id_organizador, foto], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
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

    //Obtiene todos los eventos y verifica si el usuario está inscrito
    getEventosConInscripcion(usuarioId, callback) {
        db.query('SELECT * FROM eventos', (error, eventos) => {
            if (error) {
                return callback(error, null);
            }

            // Para cada evento, verifica si el usuario está inscrito
            const eventosConInscripcion = eventos.map(evento => {
                evento.inscrito = false;
                db.query('SELECT * FROM inscripciones WHERE id_usuario = ? AND id_evento = ?', [usuarioId, evento.id], (error, result) => {
                    if (result.length > 0) {
                        evento.inscrito = true;
                    }
                });

                return evento;
            });

            callback(null, eventosConInscripcion);
        });
    }
}

module.exports = EventosDAO;