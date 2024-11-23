"use strict";
const userModel = require("../models/userDAO");
const config = require("../config");
const path = require("path");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const daoU = new userModel(pool);


class userController {

    loginPost(request,response,next){
        daoU.isUserCorrect(request.body.correo, request.body.password,
            function (error, userCorrect) {
                if (error) { // error de acceso a la base de datos
                    response.status(500);
                    response.render("login",
                        { errorMsg: error.message });
                }
                else if (userCorrect) {
    
                    request.session.currentUser = request.body.correo;
    
                    response.redirect("/usuarios/home");
                }
                else {
                    response.status(200);
                    response.render("login",
                        { errorMsg: error.message });
                }
            });
    }
    
    registerPost(request,response,next){
    
        let user = {
            nombre: request.body.nombre,
            correo: request.body.correo,
            contrasena: request.body.telefono,
            facultad: request.body.facultad,
            rol: request.body.rol
        }

        daoU.insertUser(user, function (error, usuario) {
                if (error) {
                    console.log(error);
                    next();
                }
                else {
                    request.session.currentUser = request.body.correo;
                    response.status(200).redirect("/usuarios/home");
    
                }
            });
    }

    recuperarPost(request,response,next){

    }
}


module.exports = userController;