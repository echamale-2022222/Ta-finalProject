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

const router = Router();

router.post(
    "/",
    [
        check("productName", "Product name is required").not().isEmpty(),
        check("productDescription", "Product description is mandatory").not().isEmpty(),
        check("productPrice", "Product price is required").not().isEmpty(),
        check("supplier", "The product source is obligatory").not().isEmpty(),
        check("stock", "The stock of the product is obligatory").not().isEmpty(),
    ], productPost);

router.get("/", productCatalog);

router.get("/inventory", productsInventory);

router.get("/soldOut", soldOut);

router.get("/mostSoldProduct", mostSoldProduct);

router.put(
    "/update/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], specificDetails);

router.put(
    "/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], updateProduct);

router.delete(
    "/:id",
    [
        check("id", "It is not a valid id").isMongoId(),      
    ], removedProduct);

export default router;