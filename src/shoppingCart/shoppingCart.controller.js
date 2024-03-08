import { request, response } from "express";
import ShoppingCart from "./shopping.model.js";
import Product from "../product/product.model.js";

export const createShoppingCart = async (req = request, res = response) => {
    try {
        const cliente = req.client._id;
        let tiene = await ShoppingCart.findOne({ client: cliente });

        const { productName, quantity } = req.body;
        const product = await Product.findOne({ productName });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: "There is not enough stock"
            });
        }

        if (!tiene) {
            const subTotal = product.productPrice * quantity;
            const total = subTotal;
            const shoppingCart = new ShoppingCart({ client: cliente, products: [{ productId: product._id, quantity, subTotal }], total });
            product.stock -= quantity;
            product.timesBought += quantity;

            if (product.stock === 0) {
                product.availability = false;
            }

            await product.save();
            await shoppingCart.save();
            return res.status(200).json({
                message: "Shopping cart created",
                shoppingCart
            });
        }

        const subTotal = product.productPrice * quantity;
        tiene.products.push({productId: product._id, quantity, subTotal  });
        const total = tiene.products.reduce((acc, product) => acc + product.subTotal, 0);
        
        tiene.total = total 
        product.stock -= quantity;
        product.timesBought += quantity;

        if (product.stock === 0) {
            product.availability = false;
        }

        await product.save();
        await tiene.save();

        res.status(200).json({
            message: "Product added to shopping cart",
            tiene
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error creating shopping cart",
        });
    }
}