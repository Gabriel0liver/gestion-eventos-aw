"use strict";
const UserDAO = require("../integracion/userDAO");
const express = require("express");
const userRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facultades = require("../config/db").facultades;

const daoU = new UserDAO();

userRouter.post("/register", authMiddleware.requireAnon , authMiddleware.checkRegister ,(req,res,next) =>{

    let user = {
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        telefono: req.body.telefono,
        facultad: req.body.facultad,
        rol: req.body.rol
    }

    if(!user.telefono){
        user.telefono = "";
    }

    daoU.insertUser(user, (error, usuario) => {
            if (error) {
                next(error);
            }
            else {
                if(!usuario) {
                    res.status(200);
                    res.render("register",
                        { errorMsg: "El usuario ya existe"
                        ,facultades: facultades
                        });
                }else{
                    req.session.currentUser = usuario;
                    res.status(200).redirect("/usuarios/home");
                }
            }
        });
});

userRouter.post("/login", authMiddleware.requireAnon, (req,res,next)=>{
    daoU.getUser(req.body, (error, usuario) => {
            if (error) {
                next(error);
            }
            if(usuario) {
                req.session.currentUser = usuario;
                res.redirect("/usuarios/perfil");
            }
            else {
                res.status(200);
                res.render("login",
                    { errorMsg: "Usuario o contraseña incorrectos"});
            }
        });
});

userRouter.post("/logout", authMiddleware.requireUser,(req,res,next)=>{
    req.session.destroy();
    res.redirect("/");
});

userRouter.post("/recuperar", authMiddleware.requireAnon ,(req,res,next)=>{
});

userRouter.get("/perfil", authMiddleware.requireUser, (req,res)=>{
    res.render("perfil", {user: req.session.currentUser});
});

module.exports= userRouter;