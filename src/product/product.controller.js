import { request, response } from "express";
import Product from "./product.model.js";

export const productPost = async (req, res) => {
    const admin = req.admin.role;

    console.log(user);

    if (admin !== "ADMIN") {
        return res.status(401).json({
            msg: "You are not authorized to create a product"
        });
    } else {
        const { productName, productDescription, productPrice, productCategory, supplier, stock } = req.body;
        const product = new Product({ productName, productDescription, productPrice, productCategory, supplier, stock });

        await product.save();

        res.status(200).json({
            msg: "Product saved in the database",
            product
        })
    }
}

export const productCatalog = async (req, res) => {
    const query = { availability: true };

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
    const query = { availability: true };
    const query2 = { availability: false };
    const admin = req.admin.role;

    if (admin === "ADMIN") {
        const [productsTrue, productsActive] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
        ]);
        
        const [productsFalse, productsDisabled] = await Promise.all([
            Product.countDocuments(query2),
            Product.find(query2)
        ]);
        
        res.status(200).json({
            msg: `Products available: ${productsTrue} and products not available: ${productsFalse}`,
            productsActive,
            productsDisabled
        });
    } else {
        return res.status(401).json({
            msg: "You are not authorized to see the inventory"
        });
    }
}

export const soldOut = async (req, res) => {
    const query = { availability: false };

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
        const mostSoldAvailableProducts = await Product.aggregate([
            { $match: { availability: true, timesBought: { $gt: 0 } } },
            { $group: { _id: "$timesBought", products: { $push: "$$ROOT" } } },
            { $sort: { "_id": -1 } },
            { $limit: 5 },
            { $unwind: "$products" },
            { $replaceRoot: { newRoot: "$products" } }
        ]);

        if (mostSoldAvailableProducts.length === 0) {
            return res.status(404).json({
                msg: "There are no matches"
            });
        }

        res.status(200).json({
            msg: "Most sold available products",
            products: mostSoldAvailableProducts
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

export const specificDetails = async (req, res = response) => {
    const { id } = req.params;
    const admin = req.admin.role;

    if (admin === "ADMIN") {
        const product = await Product.findById(id);
        if (!product.availability) {
            return res.status(400).json({
                msg: "The product cannot be updated, because it is not active."
            });
        } else {
            const { _id, productName, productDescription, productCategory, ...rest } = req.body;
            await Product.findByIdAndUpdate(id, rest);
            const productUpdate = await Product.findOne({ _id: id });

            res.status(200).json({
                msg: 'Updated product',
                productUpdate
            });
        }
    } else {
        res.status(400).json({
            msg: "Only people with ADMIN role can edit products"
        });
    }
}

export const updateProduct = async (req, res = response) => {
    const { id } = req.params;

    const admin = req.admin.role;

    if (admin === "ADMIN") {
        const product = await Product.findById(id);
        if (!product.availability) {
            return res.status(400).json({
                msg: "The product cannot be updated, because it is not active."
            });
        } else {
            const { _id, productPrice, supplier, stock, ...rest } = req.body;
            await Product.findByIdAndUpdate(id, rest);
            const product = await Product.findOne({ _id: id });

            res.status(200).json({
                msg: 'Updated product',
                product
            });
        }
    } else {
        res.status(400).json({
            msg: "Only people with ADMIN role can edit products"
        });
    }
}

export const removedProduct = async (req, res) => {
    const { id } = req.params;

    const admin = req.admin.role;

    if (admin === "ADMIN") {
        const product = await Product.findById(id);
        if (!product.availability) {
            return res.status(400).json({
                msg: "You cannot remove products that have already been removed."
            });
        } else {
            const product = await Product.findByIdAndUpdate(id, { availability: false });
            const productDel = await Product.findOne({ _id: id });

            res.status(200).json({
                msg: 'Removed product',
                productDel,
            });
        }
    } else {
        res.status(400).json({
            msg: "Only people with ADMIN role can delete products"
        });
    }
}

