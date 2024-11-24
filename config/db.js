"use strict";

const mysqlConfig = {
           host: "localhost",
           user: "root",         
           password: "",
           database: "aw_24"    
}

const facultades = [
    "Informática",
    "Derecho",
    "Economía",
    "Medicina",
    "Arquitectura"
];


const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aw_24',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida.');
});

module.exports = {
    db,
    mysqlConfig,
    facultades
};
