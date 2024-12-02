"use strict";
const express = require("express");
const accesibilidadRouter = express.Router();
const AccessibilityDAO = require("../integracion/accesibilidadDAO");
const authMiddleware = require('../middleware/authMiddleware');

const daoA = new AccessibilityDAO();

accesibilidadRouter.get("/", authMiddleware.requireUser, (req, res) => {
    daoA.getConfiguracion(req.session.currentUser.Id, (error, configuracion) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json({
                configuracion: configuracion
            });
        }
    });
});

accesibilidadRouter.post("/editar", authMiddleware.requireUser, (req, res) => {
    let configuracion = {
        id_usuario: req.session.currentUser.Id,
        paleta_colores: req.body.paleta_colores,
        tamano_letra: req.body.tamano_letra
    }

    daoA.crearConfiguracion(configuracion, (error, configuracion) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json({
                configuracion: configuracion
            });
        }
    });
});


module.exports= accesibilidadRouter;