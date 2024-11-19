const UserController = require("../controllers/controllerUsuario");
const express = require("express");
const userRouter = express.Router();

userController = new UserController();

/*login */
userRouter.post("/login",userController.loginPost);
userRouter.post("/register",userController.registerPost);
userRouter.post("/recuperar",userController.loginPost);

module.exports= indexRouter;