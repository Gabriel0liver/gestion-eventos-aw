"use strict";
const express = require('express');
const path = require('path');
const morgan = require("morgan");
const bodyParser = require('body-parser');

const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const app = express();
const config = require("./config/db");


const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",         
    password: "",
    database: "AW_24"    
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
app.use(middlewareSession);

const routerIndex = require('./routes/index');
const routerUsuarios= require("./routes/usuarios");
const routerEventos= require("./routes/eventos");
const routerAccesibilidad= require("./routes/accesibilidad");
const routerNotificaciones = require("./routes/notificaciones");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan("dev"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));


app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use('/usuarios',routerUsuarios)
app.use('/eventos',routerEventos)
app.use('/accesibilidad',routerAccesibilidad)
app.use('/notificaciones',routerNotificaciones)
app.use('/',routerIndex)

app.use(function(request,response,next){
    response.status(404).render("404");
})

app.use(function(error,request,response,next){
    console.error(error);
    response.status(500).render("500");
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});