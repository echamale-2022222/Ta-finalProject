import { Router } from "express";
import { check } from "express-validator";
import { addAdmin, 
        addClient, 
        removedAdmin, 
        removedClient, 
        updateRoleAdmin, 
        updateRoleClient,
        updatedAdmin, 
        updatedClient, 
        users } from "./user.controller.js";

const router = Router();

router.post(
    "/addAdmin",
    [
        check("name", "Administrator name cannot be empty").not().isEmpty(),
        check("mail", "This is not a valid email").isEmail(),
        check("password", "Password must be greater than 6 characters").isLength({min:6}),
    ], addAdmin)

router.post(
    "/addClient",
    [
        check("name", "El nombre del administrador es obligatorio").not().isEmpty(),
        check("mail", "Este no es un correo valido").isEmail(),
        check("password", "La contraseña debe ser mayor a 6 caracteres").isLength({min:6}),
    ], addClient)

router.get("/", users);

router.put(
    "/updateAdmin/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], updateRoleAdmin);

router.put(
    "/updateClient/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], updateRoleClient);

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