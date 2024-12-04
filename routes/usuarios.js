"use strict";
const UserDAO = require("../integracion/userDAO");
const AccessibilityDAO = require("../integracion/accesibilidadDAO");
const InscripcionesDAO = require("../integracion/inscripcionesDAO");
const express = require("express");
const userRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const facultades = require("../config/db").facultades;
const nodemailer = require('nodemailer');

const daoU = new UserDAO();
const daoA = new AccessibilityDAO();
const daoI = new InscripcionesDAO();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'gestioneventos92@gmail.com',
        pass: 'pjbh gmta ugoz oius'
    }
});

userRouter.post("/register", authMiddleware.requireAnon, authMiddleware.checkRegister, (req, res, next) => {

    let user = {
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        telefono: req.body.telefono,
        facultad: req.body.facultad,
        rol: req.body.rol
    }

    if (!user.telefono) {
        user.telefono = "";
    }

    daoU.insertUser(user, (error, usuarioId) => {
        if (error) {
            next(error);
        }
        else {
            if (!usuarioId) {
                res.status(200);
                res.render("register",
                    {
                        errorMsg: "El usuario ya existe"
                        , facultades: facultades
                    });
            } else {
                console.log(usuarioId);
                daoA.crearConfiguracion(usuarioId, (error) => {
                    if (error) {
                        next(error);
                    }else{
                        user.id = usuarioId;
                        req.session.currentUser = user;
                        res.status(200).redirect("/");
                    }
                });
            }
        }
    });
});

userRouter.post("/login", authMiddleware.requireAnon, (req, res, next) => {
    daoU.getUser(req.body, (error, usuario) => {
        if (error) {
            next(error);
        }
        if (usuario) {
            req.session.currentUser = usuario;
            res.redirect("/");
        }
        else {
            res.status(200);
            res.render("login",
                { errorMsg: "Usuario o contraseña incorrectos" });
        }
    });
});

userRouter.post("/logout", authMiddleware.requireUser, (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
});

userRouter.post("/recuperar", authMiddleware.requireAnon, (req, res, next) => {

    const correo = req.body.correo;

    daoU.recuperar(correo, (error, contrasena) => {
        if (error) {
            next(error);
        }
        if (contrasena) {
            const mailOptions = {
                to: correo,
                from: 'gestioneventos92@gmail.com',
                subject: 'Recuperación de contraseña',
                text: `Has solicitado la recuperación de tu contraseña.\n
                    La contraseña asociada a tu cuenta con correo ${correo} es: ${contrasena}\n`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    return next(err);
                }
                res.status(200).render("recuperar", {
                    success: "Se ha enviado un correo con la contraseña"
                });
            });
        }
        else {
            res.status(200);
            res.render("recuperar",
                { errorMsg: "El correo no existe" });
        }
    });
});

userRouter.get("/perfil", authMiddleware.requireUser, (req, res) => {
    const usuarioId = req.session.currentUser.id;

    daoI.getHistorialEventosUsuario(usuarioId, (error, historial) => {
        if (error) {
            return next(error);
        }
        res.render("perfil", { user: req.session.currentUser, historial: historial });
    });
});

userRouter.post("/editar", authMiddleware.requireUser, (req, res, next) => {
    const usuarioId = req.session.currentUser.id;
    const datos = {
        id: usuarioId,
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        facultad: req.body.facultad
    }

    if (datos.telefono == "") {
        datos.telefono = null;
    }

    daoU.updateUser(datos, (error, usuario) => {
        if (error) {
            next(error);
        }
        const usuarionuevo = req.session.currentUser;
        usuarionuevo.nombre = datos.nombre;
        usuarionuevo.telefono = datos.telefono;
        usuarionuevo.facultad = datos.facultad;
        req.session.currentUser = usuarionuevo;
        daoI.getHistorialEventosUsuario(usuarioId, (error, historial) => {
            if (error) {
                return next(error);
            }
            res.render("perfil", { user: req.session.currentUser, historial: historial });
        });
    });
});

module.exports = userRouter;