"use strict";

const { db } = require("../config/db");

class AccessibilityDAO {

    //crear configuracion de accesibilidad al registrar usuario
    crearConfiguracion(id_usuario, callback){

        const paleta_colores = "default";
        const tamano_fuente = "mediano";

        db.query("INSERT INTO configuraciones_accesibilidad (id_usuario, paleta_colores, tamano_fuente) values(?,?,?)",
        [id_usuario, paleta_colores, tamano_fuente], (e, rows) =>{
            if (e) callback(new Error(e));
            else callback(null);
        });
    }

    //obtener configuracion de accesibilidad de un usuario
    getConfiguracion(id_usuario, callback){
        db.query("SELECT * FROM configuraciones_accesibilidad WHERE id_usuario = ?", [id_usuario], (e, rows) =>{
            if (e) callback(new Error(e));
            else {
                if (rows.length === 0) callback(null, null);
                else callback(null, rows[0]);
            }
        })
    }

    //editar configuracion de accesibilidad de un usuario
    editarConfiguracion(configuracion, callback){
        db.query("UPDATE configuraciones_accesibilidad SET paleta_colores = ?, tamano_fuente = ? WHERE id_usuario = ?",
        [configuracion.paleta_colores, configuracion.tamano_fuente, configuracion.id_usuario], (e, rows) =>{
            if (e) callback(new Error(e));
            else callback(null,configuracion);
        });
    }

}

module.exports = AccessibilityDAO