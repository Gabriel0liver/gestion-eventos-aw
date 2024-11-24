const express = require("express");
const indexRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

indexRouter.get("/", (request, response) =>{
    response.status(200).render("hello")}
);

indexRouter.get("/login", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("login")}
);

indexRouter.get("/register", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("register",{facultades: ["informática", "filosofía"]})}
);

indexRouter.get("/recuperar", authMiddleware.requireAnon, (request, response) =>{
    response.status(200).render("recuperar")}
);

module.exports= indexRouter;