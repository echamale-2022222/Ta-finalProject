import { Router } from "express";
import { createInvoice } from "./invoice.controller.js";
import { validateClientJWT } from "../middlewares/validate-jwt.js"; 

const router = Router();

router.post(
    "/",
    [
        validateClientJWT
    ], createInvoice);

export default router;