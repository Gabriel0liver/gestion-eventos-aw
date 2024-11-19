"use strict";
const express = require('express');
const path = require('path');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const app = express();
const config = require("./config");

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
//const routerUsuarios= require("./routes/routerUsuarios");
//const routerEventos= require("./routes/routerEventos");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan("dev"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); // support json encoded bodies

//app.use('/usuarios',routerUsuarios)
//app.use('/eventos',routerEventos)
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