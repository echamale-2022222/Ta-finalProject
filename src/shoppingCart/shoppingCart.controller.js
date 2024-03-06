import { request, response } from "express";
import ShoppingCart from "./shoppingCart.model.js";

export const createShoppingCart = async (req = request, res = response) => {
    try {
        const cliente =  req.client._id;
        const { id } = req.params;
        const { quantity } = req.body;

        const shoppingCart = new ShoppingCart({ client: cliente, products: [{ productId: id, quantity }]});

        await shoppingCart.save();

        res.status(200).json({
            message: "Shopping cart created",
            shoppingCart
        });
    } catch (error) {
        console.log(error),
        res.status(500).json({
            message: "Error creating shopping cart",
        });
    }
}