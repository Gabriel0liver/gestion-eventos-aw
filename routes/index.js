const express = require("express");
const indexRouter = express.Router();
const path = require("path");

indexRouter.get("/", (req, res) =>{
    console.log("Hola mundo");
    res.status(200).render("hello")}
);

module.exports= indexRouter;