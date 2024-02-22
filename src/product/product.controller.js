import { request, response } from "express";
import Product from "./product.model.js";

export const productPost = async (req, res) => {
    const { productName, productDescription, productPrice, productCategory, supplier, stock } = req.body;
    const product = new Product({ productName, productDescription, productPrice, productCategory, supplier, stock });

    await product.save();

    res.status(200).json({
        msg: "Product saved in the database",
        product
    })
}

export const productCatalog = async (req, res) => {
    const query = {availability: true};

    const [quantityProducts, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
    ]);

    res.status(200).json({
        msg: "catalog of available products",
        quantityProducts,
        products
    });
}

export const productsInventory = async (req, res) => {
    const query = {availability: true};

    const [productsInventory, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
    ]);

    res.status(200).json({
        msg: "Products available in inventory",
        productsInventory,
        products
    });
}

export const soldOut = async (req, res) => {
    const query = {availability: false};

    const [productsOutOfStock, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
    ]);

    res.status(200).json({
        msg: "Products currently out of stock",
        productsOutOfStock,
        products
    });
}

export const mostSoldProduct = async (req, res) => {
    try {
        const mostSoldAvailableProduct = await Product.aggregate([
            { $match: { availability: true } },
            { $sort: { timesBought: -1 } },
            { $limit: 1 }
        ]);

        if (mostSoldAvailableProduct.length === 0 || mostSoldAvailableProduct[0].timesBought === 0) {
            return res.status(404).json({
                msg: "There are no matches"
            });
        }

        res.status(200).json({
            msg: "Most sold available product",
            product: mostSoldAvailableProduct[0]
        });
    } catch (error) {
        res.status(500).json({
            error: error.message 
        });
    }
};

