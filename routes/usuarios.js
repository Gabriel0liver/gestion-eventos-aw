"use strict";

const UserDAO = require("../models/userDAO");
const express = require("express");
const userRouter = express.Router();
const config = require("../config");
const authMiddleware = require('../middleware/authMiddleware');
const mysql = require('mysql');

const daoU = new UserDAO(mysql.createPool(config.mysqlConfig));

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
                        { errorMsg: "El usuario ya existe"});
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
                res.redirect("/usuarios/home");
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

userRouter.get("/home", authMiddleware.requireUser, (req,res)=>{
    console.log(req.session.currentUser);
    res.render("home", {user: req.session.currentUser});
});

module.exports= userRouter;