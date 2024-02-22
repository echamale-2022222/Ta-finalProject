import { Router } from "express";
import { check } from "express-validator";
import { categoryPost, deleteCategory, existingCategories, updateCategory } from "./category.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("categoryName", "The category name cannot be empty").not().isEmpty(),
        check("categoryDescription", "The category description cannot be empty").not().isEmpty(),
    ], categoryPost)

router.get("/", existingCategories);

router.put(
    "/:id",
    [
        check("id", "It is not a valid id").isMongoId(),
    ], updateCategory);

router.delete(
    "/:id",
    [
        check("id", "It is not a valid id").isMongoId(),
    ], deleteCategory)

export default router;