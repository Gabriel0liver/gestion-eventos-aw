"use strict";

class UserDAO {
    constructor(pool) {
        this.pool = pool
    }

    insertUser(user, callback){
        console.log(user)
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(DB_CONNECTION_ERROR_MESSAGE))

            else {
                c.query("SELECT idUsuario FROM ucm_aw_cau_usu_usuarios WHERE correo = ?", [user.correo],
                function(e, rows) {
                    if (e) callback(new Error(DB_ACCESS_ERROR_MESSAGE))
                    
                    else {
                        if (rows != 0) callback(new Error("Ya existe este usuario"))
                        else {
                            
                            //usuario técnico
                            if(user.tecnico === 1){
                                c.query("INSERT INTO ucm_aw_cau_usu_usuarios (nombre, correo, contrasena, perfil, tecnico , nEmpleado, img) values(?,?,?, 'PAS', 1, ?, ?)",
                                [user.nombre,user.correo,user.contrasena,user.nEmpleado,user.img], function(e, rows){
                                    console.log(rows)
                                    c.release()
                                    if (e) callback(new Error(DB_ACCESS_ERROR_MESSAGE))
                                    else callback(null,true)
                                });
                            }
                            //usuario no técnico
                            else{ 
                                c.query("INSERT INTO ucm_aw_cau_usu_usuarios (nombre, correo, contrasena, perfil, tecnico , nEmpleado, img) values(?,?,?, ?, 0, NULL, ?)",
                                [user.nombre,user.correo,user.contrasena,user.perfil,user.img], function(e, rows){
                                    c.release()
                                    if (e) callback(new Error(DB_ACCESS_ERROR_MESSAGE))
                                    else callback(null,true)
                                });
                            }
                        }
                    }
                })
            }
        })      
    }
}

module.exports = UserDAO