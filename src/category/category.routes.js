import { Router } from "express";
import { check } from "express-validator";
import { categoryPost, deleteCategory, existingCategories, updateCategory } from "./category.controller.js";
import { validateFields }  from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        check("categoryName", "The category name cannot be empty").not().isEmpty(),
        check("categoryDescription", "The category description cannot be empty").not().isEmpty(),
        validateFields,
    ], categoryPost)

router.get("/", existingCategories);

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
        validateFields,
    ], updateCategory);

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
    ], deleteCategory)

export default router;