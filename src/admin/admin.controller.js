import { response, request } from "express";
import bycryptjs from "bcryptjs";
import Admin from "./admin.model.js";

export const adminPost = async (req = request, res = response) => {
    const { nombre, correo, password } = req.body;
    const admin = new Admin({ nombre, correo, password });

    const salt = bycryptjs.genSaltSync();
    admin.password = bycryptjs.hashSync(password, salt);

    await admin.save();

    res.status(200).json({
        admin
    });
}