"use strict";

const { db } = require("../config/db");

class UserDAO {

    insertUser(user, callback){
        db.query("SELECT Id FROM usuarios WHERE correo = ?", [user.correo], (e, rows) =>{
            if (e) callback(e);
            else {
                if (rows != 0) callback(null, null);
                else {
                    db.query("INSERT INTO usuarios (nombre, correo, contrasena, facultad, rol) values(?,?,?,?,?)",
                    [user.nombre,user.correo,user.contrasena,user.facultad,user.rol], (e, rows) =>{
                        if (e) callback(new Error(e));
                        else callback(null,rows.insertId);
                    });
                }
            }
        })    
    }

    recuperar(email, callback){
        db.query("SELECT contrasena FROM usuarios WHERE correo = ?", [email], (e, rows) =>{
            if (e) callback(e);
            else {
                if (rows != 0) callback(null, rows[0].contrasena);
                else callback(null, null);
            }
        })
    }

    getUser(user, callback){
        db.query("SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?", [user.correo, user.contrasena],
        function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows[0])
            }
        })  
    }

    updateUser(user, callback){
        db.query("UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, facultad = ?, rol = ? WHERE Id = ?",
        [user.nombre,user.correo,user.contrasena,user.facultad,user.rol,user.Id], (e, rows) =>{
            if (e) callback(new Error(e));
            else callback(null,user);
        });
    }


    verifyOrganizador(id_organizador, callback){
        db.query("SELECT id FROM usuarios WHERE id = ? AND rol = 'organizador'", [id_organizador], (e, rows) =>{
            if (e) callback(new Error(e));
            else {
                if (rows.length === 0) callback(null, false);
                else callback(null, true);
            }
        });
    }
}

module.exports = UserDAO