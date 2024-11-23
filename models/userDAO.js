"use strict";

const DB_CONNECTION_ERROR_MESSAGE = "Error en la conexión con la bd"
const DB_ACCESS_ERROR_MESSAGE = "Error de acceso a la bd"

class UserDAO {
    constructor(pool) {
        this.pool = pool
    }

    insertUser(user, callback){
        console.log(user)
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(DB_CONNECTION_ERROR_MESSAGE))

            else {
                c.query("SELECT Id FROM usuarios WHERE correo = ?", [user.correo],
                function(e, rows) {
                    if (e) callback(e)
                    else {
                        if (rows != 0) callback(new Error("Ya existe este usuario"))
                        else {
                            c.query("INSERT INTO usuarios (nombre, correo, contrasena, facultad, rol) values(?,?,?,?,?)",
                            [user.nombre,user.correo,user.contrasena,user.facultad,user.rol], function(e, rows){
                                console.log(rows)
                                c.release()
                                if (e) console.log(e);
                                else callback(null,true)
                            });
                        }
                    }
                })
            }
        })      
    }
}

module.exports = UserDAO