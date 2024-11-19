const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (request, response) =>{
    response.status(200).render("hello")}
);

indexRouter.get("/login", (request, response) =>{
    response.status(200).render("login")}
);

indexRouter.get("/register", (request, response) =>{
    response.status(200).render("register",{facultades: ["informática", "filosofía"]})}
);

indexRouter.get("/recuperar", (request, response) =>{
    response.status(200).render("recuperar")}
);

module.exports= indexRouter;