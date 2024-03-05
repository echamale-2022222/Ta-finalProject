import { Router } from "express";
import { check } from "express-validator";
import {addClient, 
        removedClient, 
        updateRoleAdmin,
        updatedClient } from "./user.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";


const router = Router();

router.post(
    "/addClient",
    [
        validateJWT,
        check("name", "El nombre del administrador es obligatorio").not().isEmpty(),
        check("mail", "Este no es un correo valido").isEmail(),
        check("password", "La contraseña debe ser mayor a 6 caracteres").isLength({min:6}),
        validateFields,
    ], addClient)

router.put(
    "/updateAdmin/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),      
    ], updateRoleAdmin);

router.put(
    "/updateClient/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),      
    ], updatedClient);
    
router.delete(
    "/delClient/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
    ], removedClient);

export default router;