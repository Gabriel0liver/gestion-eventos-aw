const UserController = require("../controllers/controllerUsuario");
const express = require("express");
const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/login", userController.loginPost);

userRouter.post("/register", userController.registerPost);

userRouter.post("/recuperar",userController.recuperarPost);

module.exports= userRouter;