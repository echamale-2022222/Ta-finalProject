import { Router } from "express";
import { check } from "express-validator";
import { clientPost } from "./client.controller.js";
import { mostSoldProduct, productByName, productCatalog, productsByCategory } from "../product/product.controller.js";
import { existingCategories } from "../category/category.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("name", "Client name cannot be empty").not().isEmpty(),
        check("mail", "This is not a valid email").isEmail(),
        check("password", "Password must be greater than 6 characters").isLength({min:6}),
    ], clientPost)

router.get("/catalog", productCatalog);

router.get("/bestSellingProductsCatalog", mostSoldProduct);

router.get("/searchByName/:productName", productByName);

router.get("/categories", existingCategories);

router.get("/searchByCategory/:categoryName", productsByCategory);

export default router;