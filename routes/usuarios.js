//const UserController = require("../controllers/controllerUsuario");
const express = require("express");
const userRouter = express.Router();

//const userController = new UserController();

userRouter.post("/login", (req,res,next) =>{

    let user = {
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.telefono,
        facultad: req.body.facultad,
        rol: req.body.rol
    }

    daoU.insertUser(user, (error, usuario) => {
            if (error) {
                console.log(error);
                next();
            }
            else {
                req.session.currentUser = req.body.correo;
                res.status(200).redirect("/usuarios/home");

            }
        });
});

userRouter.post("/register", (req,res,next)=>{
    daoU.isUserCorrect(req.body.correo, req.body.password,
        (error, userCorrect) => {
            if (error) { // error de acceso a la base de datos
                res.status(500);
                res.render("login",
                    { errorMsg: error.message });
            }
            else if (userCorrect) {

                req.session.currentUser = req.body.correo;

                res.redirect("/usuarios/home");
            }
            else {
                res.status(200);
                res.render("login",
                    { errorMsg: error.message });
            }
        });
});

userRouter.post("/recuperar",()=>{

});

module.exports= userRouter;