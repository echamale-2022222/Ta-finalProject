import { response, request } from "express";
import bycryptjs from "bcryptjs";
import Client from "./client.model.js";
import Invoice from "../invoice/invoice.model.js";

export const clientPost = async (req = request, res = response) => {
    const { name, mail, password } = req.body;
    const client = new Client({ name, mail, password });

    const salt = bycryptjs.genSaltSync();
    client.password = bycryptjs.hashSync(password, salt);

    await client.save();

    res.status(200).json({
        msg: "Customer added to database",
        client
    });
}

export const getInvoices = async (req = request, res = response) => {
    const client = req.client;
    console.log(client._id);
    const clientR = await Invoice.findOne({ client: client._id});
    console.log(clientR);
    if (!clientR) {
        return res.status(404).json({ message: "Client not found" });
    } else {
        const invoices = await Client.findById(client._id).populate("invoice");
        res.status(200).json(invoices.invoice);
    } 
}

