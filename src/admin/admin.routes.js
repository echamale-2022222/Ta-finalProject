import { Router } from "express";
import { check } from "express-validator";
import { adminPost } from "./admin.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("nombre", "El nombre del administrador es obligatorio").not().isEmpty(),
        check("correo", "Este no es un correo valido").isEmail(),
        check("password", "La contraseña debe ser mayor a 6 caracteres").isLength({min:6}),
    ], adminPost)

export default router;