import { Router } from "express";
import { check } from "express-validator";
import { clientPost } from "./client.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("name", "El nombre del administrador es obligatorio").not().isEmpty(),
        check("mail", "Este no es un correo valido").isEmail(),
        check("password", "La contraseña debe ser mayor a 6 caracteres").isLength({min:6}),
    ], clientPost)

export default router;