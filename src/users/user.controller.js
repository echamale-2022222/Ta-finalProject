import bycryptjs from "bcryptjs";
import Admin from "../admin/admin.model.js"
import Client from "../client/client.model.js"

export const addClient = async (req = request, res = response) => {
    const { name, mail, password } = req.body;
    const admin = req.admin.role;

    if (admin !== 'ADMIN') {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else {
        const client = new Client({ name, mail, password });

        const salt = bycryptjs.genSaltSync();
        client.password = bycryptjs.hashSync(password, salt);

        await client.save();

        res.status(200).json({
            msg: "Customer added to database",
            client
        });
    }
}

export const updateRoleAdmin = async (req, res = response) => {
    const { id } = req.params;
    const { _id, name, mail, password, state, ...rest } = req.body;
    const admin = req.admin.role;

    if (req.admin.mail !== "admin@gmail.com") {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else if (admin === "ADMIN") {
        const admin = await Admin.findById(id);

        if (!admin) {
            await Client.findByIdAndUpdate(id, rest);
            const upgradeToAdmin = await Client.findById(id);
            const customerToAdmin = new Admin(upgradeToAdmin.toObject());
            const deleteCustomer = await Client.findByIdAndDelete(id);

            await customerToAdmin.save();

            const admin = await Admin.findOne({ _id: id });
            res.status(200).json({
                msg: "Customer updated to admin",
                admin
            });
        } else {
            return res.status(404).json({
                msg: "Admin already exists"
            });
        }
    } else {
        return res.status(401).json({
            msg: "You don't have the necessary permissions, only the main admin can do this action."
        });
    }
}

export const updatedRoleClient = async (req, res) => {
    const { id } = req.params;
    const { _id, name, mail, password, state, ...rest } = req.body;
    const admin = req.admin.role;

    if (req.admin.mail !== "admin@gmail.com") {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else if (admin === "ADMIN") {
        const client = await Client.findById(id);

        if (!client) {
            await Admin.findByIdAndUpdate(id, rest);
            const upgradeToClient = await Admin.findById(id);
            const adminToCustomer = new Client(upgradeToClient.toObject());
            const deleteAdmin = await Admin.findByIdAndDelete(id);

            await adminToCustomer.save();

            const client = await Client.findOne({ _id: id });
            res.status(200).json({
                msg: "Admin upgraded to Customer",
                client
            });
        } else {
            return res.status(404).json({
                msg: "Client already exists"
            });
        }
    } else {
        return res.status(401).json({
            msg: "You don't have the necessary permissions, only the main admin can do this action."
        });
    }
}

export const updatedClient = async (req, res) => {
    const { id } = req.params;
    const { _id, state, ...rest } = req.body;
    const admin = req.admin.role;

    if (req.admin.mail !== "admin@gmail.com") {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else if (admin === "ADMIN") {

        const client = await Client.findByIdAndUpdate(id, rest);

        const clientUpdate = await Client.findOne({ _id: id });
        res.status(200).json({
            msg: "Customer update",
            clientUpdate
        });

    } else {
        return res.status(401).json({
            msg: "You don't have the necessary permissions, only the main admin can do this action."
        });
    }
}

export const removedClient = async (req, res) => {
    const { id } = req.params;
    const admin = req.admin.role;

    if (req.admin.mail !== "admin@gmail.com") {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else if (admin === "ADMIN"){

        const client = await Client.findByIdAndUpdate(id, { state: false });
        const clientDel = await Client.findOne({ _id: id });
    
        res.status(200).json({
            msg: "Removed client",
            clientDel
        });
    } else {
        return res.status(401).json({
            msg: "You don't have the necessary permissions, only the main admin can do this action."
        });
    }
}