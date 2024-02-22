import { response, request } from "express";
import bycryptjs from "bcryptjs";
import Client from "./client.model.js";

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