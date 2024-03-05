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

    await Client.findByIdAndUpdate(id, rest);

}

export const updatedAdmin = async (req, res) => {
    const { id } = req.params;
    const { _id, role, state, ...rest } = req.body;

    await Admin.findByIdAndUpdate(id, rest);

    const admin = await Admin.findOne({ _id: id });

    res.status(200).json({
        msg: "Updated admin",
        admin
    });
}

export const updatedClient = async (req, res) => {
    const { id } = req.params;
    const { _id, role, state, ...rest } = req.body;

    await Client.findByIdAndUpdate(id, rest);

    const client = await Client.findOne({ _id: id });

    res.status(200).json({
        msg: "Updated client",
        client
    });
}

export const removedAdmin = async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndUpdate(id, { state: false });
    const adminDel = await Admin.findOne({ _id: id });

    res.status(200).json({
        msg: "Removed Admin",
        adminDel
    });
}

export const removedClient = async (req, res) => {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(id, { state: false });
    const clientDel = await Client.findOne({ _id: id });

    res.status(200).json({
        msg: "Removed client",
        clientDel
    });
}