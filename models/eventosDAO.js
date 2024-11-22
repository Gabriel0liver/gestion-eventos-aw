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

    getEventosOrganizador(id_organizador, callback){
        db.query("SELECT * FROM eventos WHERE id_organizador = ?", [id_organizador], function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows)
            }
        })
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
}

module.exports = EventosDAO;