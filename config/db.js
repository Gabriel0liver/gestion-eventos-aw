"use strict";
module.exports = {
   mysqlConfig: {
           host: "localhost",
           user: "root",         
           password: "",
           database: "AW_24"    
   }              
}

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'AW_24',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida.');
});

module.exports = db;
