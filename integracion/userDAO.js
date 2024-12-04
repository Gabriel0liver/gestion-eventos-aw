"use strict";

const { db } = require("../config/db");

class UserDAO {

    //Registra un usuario en la base de datos
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

    //Retorna la contraseña de un usuario para recuperarla
    recuperar(email, callback){
        db.query("SELECT contrasena FROM usuarios WHERE correo = ?", [email], (e, rows) =>{
            if (e) callback(e);
            else {
                if (rows != 0) callback(null, rows[0].contrasena);
                else callback(null, null);
            }
        })
    }

    //Para verificar si un usuario existe
    getUser(user, callback){
        db.query("SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?", [user.correo, user.contrasena],
        function(e, rows) {
            if (e) callback(new Error(e));
            else {
                callback(null, rows[0])
            }
        })  
    }

    //Edita informacion de un usuario
    updateUser(user, callback){
        db.query("UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, facultad = ?, rol = ? WHERE Id = ?",
        [user.nombre,user.correo,user.contrasena,user.facultad,user.rol,user.Id], (e, rows) =>{
            if (e) callback(new Error(e));
            else callback(null,user);
        });
    }

    //Verifica si el usuario es un organizador
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