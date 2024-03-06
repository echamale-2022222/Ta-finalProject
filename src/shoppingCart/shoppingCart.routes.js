import { Router } from "express";
import { check } from "express-validator";
import { createShoppingCart } from "./shoppingCart.controller.js";
import { validateClientJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/add",
    [
        validateClientJWT,
        check("id", "The id is required").not().isEmpty(),
        check("productName", "The product name is required").not().isEmpty(),
        check("quantity", "The quantity is required").not().isEmpty(),
    ], createShoppingCart);

export default router;