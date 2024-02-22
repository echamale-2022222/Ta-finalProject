import { Router } from "express";
import { check } from "express-validator";
import { adminPost } from "./admin.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("nombre", "Administrator name cannot be empty").not().isEmpty(),
        check("correo", "This is not a valid email").isEmail(),
        check("password", "Password must be greater than 6 characters").isLength({min:6}),
    ], adminPost)

export default router;