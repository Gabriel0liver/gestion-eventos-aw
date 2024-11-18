const userController = require("../controllers/controllerUsuario");
const express = require("express");
const indexRouter = express.Router();

/*login */
userRouter.get("/login",userController.loginGet);
userRouter.post("/login",userController.loginPost);

module.exports= indexRouter;