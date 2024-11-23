const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const sql = "SELECT * FROM eventos";

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener eventos");
        }
        res.render("eventos", { eventos: resultados });
    });
});

router.get("/crear", (req, res) => {
    res.render("formularioEvento");
});

router.post("/crear", (req, res) => {
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, tipo } = req.body;

    //ID del organizador (harcodeado por ahora)
    const id_organizador = 1;

    //Verificar si el organizador es válido
    const sqlVerificarOrganizador = "SELECT id FROM usuarios WHERE id = ? AND rol = 'organizador'";
    db.query(sqlVerificarOrganizador, [id_organizador], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error en el servidor al verificar el organizador.");
        }
        if (results.length === 0) {
            return res.status(400).send("Organizador no válido.");
        }

        // Insertar el evento
        const sqlInsertEvento = `
            INSERT INTO eventos (titulo, descripcion, fecha, ubicacion, capacidad_maxima, tipo, id_organizador)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
            sqlInsertEvento,
            [titulo, descripcion, `${fecha} ${hora}`, ubicacion, capacidad_maxima, tipo, id_organizador],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al crear el evento.");
                }
                res.status(200).send("Evento creado con éxito.");
            }
        );
    });
});


module.exports= router;