import { Router } from "express";
import { check } from "express-validator";
import {addClient, 
        removedAdmin, 
        removedClient, 
        updateRoleAdmin,
        updatedAdmin, 
        updatedClient, 
        } from "./user.controller.js";
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
    "/updateAd/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], updatedAdmin);

router.put(
    "/updateCl/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], updatedClient);
    
router.delete(
    "/delAdmin/:id",
    [
        check("id", "It is not a valid id").isMongoId(),
    ], removedAdmin);

router.delete(
    "/delClient/:id",
    [
        check("id", "It is not a valid id").isMongoId(),
    ], removedClient);

export default router;