import { Router } from "express";
import { check } from "express-validator";
import { categoryPost } from "./category.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("categoryName", "The category name cannot be empty").not().isEmpty(),
        check("categoryDescription", "The category description cannot be empty").not().isEmpty(),
    ], categoryPost)

export default router;