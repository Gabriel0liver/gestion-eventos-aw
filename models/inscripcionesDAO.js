"use strict";

const { db } = require("../config/db");

class InscripcionesDAO {

    getInscripciones(callback, id_evento, id_usuario){
        db.query("SELECT * FROM inscripciones WHERE id_evento = ? AND id_usuario = ?", [id_evento, id_usuario], function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows)
            }
        })
    }

    insertInscripcion(inscripcion, callback){
        db.query("INSERT INTO inscripciones (id_evento, id_usuario) values(?,?)",
        [inscripcion.id_evento, inscripcion.id_usuario], (e, rows) =>{
            c.release()
            if (e) callback(new Error(e));
            else callback(null,inscripcion);
        });
              
    }
}
