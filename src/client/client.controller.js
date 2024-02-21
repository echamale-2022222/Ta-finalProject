import { response, request } from "express";
import bycryptjs from "bcryptjs";
import Client from "./client.model.js";

export const clientPost = async (req = request, res = response) => {
    const { nombre, correo, password } = req.body;
    const client = new Client({ nombre, correo, password });

    const salt = bycryptjs.genSaltSync();
    client.password = bycryptjs.hashSync(password, salt);

    await client.save();

    res.status(200).json({
        client
    });
}