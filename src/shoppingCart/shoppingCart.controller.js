import { request, response } from "express";
import Client from "../client/client.model.js";
import Product from "../product/product.model.js";

let shoppingCart = [];

export const createShoppingCart = async (req = request, res = response) => {
    const cliente = req.client._id;
    const { productName, quantity } = req.body;

    const client = await Client.findOne({ _id: cliente });
    const product = await Product.findOne({ productName: productName });

    if (!client) {
        return res.status(404).json({
            message: "Client not found",
        });
    }
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    } else if (product.productStock < quantity) {
        return res.status(400).json({
            message: "There is not enough stock",
        });
    }

    const total = product.productPrice * quantity;

    shoppingCart.push(
        cliente, product._id, quantity, total
    );

    res.status(201).json({
        message: "Product added to shopping cart",
        shoppingCart
    });
}
