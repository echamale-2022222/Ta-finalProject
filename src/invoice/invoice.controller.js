import { request, response } from "express";
import Invoice from "./invoice.model.js";
import ShoppingCart from "../shoppingCart/shopping.model.js";
import Client from "../client/client.model.js";

export const createInvoice = async (req, res) => {
    const cliente = req.client;

    const shoppingCart = await ShoppingCart.findOne({ client: cliente._id });

    if (!shoppingCart) {     
        return res.status(404).json({ message: "Shopping Cart not found" });
    } else {
        const invoice = new Invoice({
            client: cliente._id,
            products: shoppingCart.products,
            total: shoppingCart.total
        });

        try {
            const savedInvoice = await invoice.save();
            res.status(201).json(savedInvoice);
            const id = await Invoice.findOne({ client: cliente._id });
            await Client.findByIdAndUpdate(cliente._id, { $push: { invoice: id } });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

}
