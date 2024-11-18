const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (request, response) =>{
    console.log("Hola mundo");
    response.status(200).render("hello")}
);

module.exports= indexRouter;