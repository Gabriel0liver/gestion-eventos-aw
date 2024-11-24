"use strict";

class UserDAO {

    constructor(pool) {
        this.pool = pool
    }

    insertUser(user, callback){
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(e));
            else {
                c.query("SELECT Id FROM usuarios WHERE correo = ?", [user.correo], (e, rows) =>{
                    if (e) callback(e);
                    else {
                        if (rows != 0) callback(null, null);
                        else {
                            c.query("INSERT INTO usuarios (nombre, correo, contrasena, facultad, rol) values(?,?,?,?,?)",
                            [user.nombre,user.correo,user.contrasena,user.facultad,user.rol], (e, rows) =>{
                                c.release()
                                if (e) callback(new Error(e));
                                else callback(null,user);
                            });
                        }
                    }
                })
            }
        })      
    }

    getUser(user, callback){
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(e));
            else {
                c.query("SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?", [user.correo, user.contrasena],
                function(e, rows) {
                    if (e) callback(new Error(e));
                    else {
                        callback(null, rows[0])
                    }
                })
            }
        })      
    }

    updateUser(user, callback){
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(e));
            else {
                c.query("UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, facultad = ?, rol = ? WHERE Id = ?",
                [user.nombre,user.correo,user.contrasena,user.facultad,user.rol,user.Id], (e, rows) =>{
                    c.release()
                    if (e) callback(new Error(e));
                    else callback(null,user);
                });
            }
        })      
    }

    
}

module.exports = UserDAO