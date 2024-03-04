import { Router } from "express";
import { check } from "express-validator";

import { login } from "./auth.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";

const router = Router()

router.post(
    '/login',
    [
        check('mail', 'This is not a valid email').isEmail(),
        check('password', 'The password is mandatory').not().isEmpty(),
        validateFields,
    ], login)

export default router