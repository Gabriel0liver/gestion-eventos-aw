"use strict";
const express = require("express");
const accesibilidadRouter = express.Router();
const AccessibilityDAO = require("../integracion/accesibilidadDAO");
const authMiddleware = require('../middleware/authMiddleware');

const daoA = new AccessibilityDAO();

accesibilidadRouter.get("/", authMiddleware.requireUser, (req, res, next) => {
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

accesibilidadRouter.put("/editar", authMiddleware.requireUser, (req, res, next) => {
    let configuracion = {
        id_usuario: req.session.currentUser.Id,
        paleta_colores: req.body.paleta_colores,
        tamano_letra: req.body.tamano_fuente
    }

    daoA.editarConfiguracion(configuracion, (error, configuracion) => {
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