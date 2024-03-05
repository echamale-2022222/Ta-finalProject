import { Router } from "express";
import { check } from "express-validator";
import { productPost, 
        productCatalog, 
        productsInventory, 
        soldOut, 
        mostSoldProduct,
        specificDetails, 
        updateProduct,
        removedProduct} from "./product.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/",
    [   
        validateJWT,
        check("productName", "Product name is required").not().isEmpty(),
        check("productDescription", "Product description is mandatory").not().isEmpty(),
        check("productCategory", "Product category is required").not().isEmpty(),
        check("productPrice", "Product price is required").not().isEmpty(),
        check("supplier", "The product source is obligatory").not().isEmpty(),
        check("stock", "The stock of the product is obligatory").not().isEmpty(),
    ], productPost);

router.get("/", productCatalog);

router.get("/inventory", validateJWT, productsInventory);

router.get("/soldOut", soldOut);

router.get("/mostSoldProduct", mostSoldProduct);

router.put(
    "/update/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),      
    ], specificDetails);

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),      
    ], updateProduct);

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),      
    ], removedProduct);

export default router;