import bycryptjs from "bcryptjs";
import Admin from "../admin/admin.model.js"
import Client from "../client/client.model.js"

export const addClient = async (req = request, res = response) => {
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

export const users = async (req, res) => {
    const query = {state: true};

    const [quantityAdmins, admins] = await Promise.all([
        Admin.countDocuments(query),
        Admin.find(query)
    ]);

    const [quantityClients, clients] = await Promise.all([
        Client.countDocuments(query),
        Client.find(query)
    ]);

    const quantityUsers = quantityAdmins + quantityClients;

    console.log("Consulta:", query);

    res.status(200).json({
        msg: "Users",
        quantityUsers,
        quantityAdmins,
        quantityClients,
        admins,
        clients
    });
}

export const updateRoleClient = async (req, res = response) => {
    const { id } = req.params;
    const {_id, name, mail, password, state, ...rest} = req.body;

    await Client.findByIdAndUpdate(id, rest);

    let admin;
    if (rest.role === 'ADMIN') {
        const existingAdmin = await Admin.findById(id);

        if (existingAdmin) {
            await Admin.findByIdAndUpdate(id, { ...rest, state: true });
        } else {
            const updatedClient = await Client.findById(id);
            const admin = new Admin(updatedClient.toObject());
            await admin.save();
        }

        await Client.findByIdAndUpdate(id, { state: false });

        res.status(200).json({
            msg: 'Updated client to admin',
            client: admin || existingAdmin
        });
    } else {
        const updatedClient = await Client.findOne({ _id: id });

        res.status(200).json({
            msg: 'Updated client',
            client: updatedClient
        });
    }
}

export const updatedAdmin = async (req, res) => {
    const { id } = req.params;
    const { _id, role, state,...rest} = req.body;

    await Admin.findByIdAndUpdate(id, rest);

    const admin = await Admin.findOne({_id: id});

    res.status(200).json({
        msg: "Updated admin",
        admin
    });
}

export const updatedClient = async (req, res) => {
    const { id } = req.params;
    const { _id, role, state,...rest} = req.body;

    await Client.findByIdAndUpdate(id, rest);

    const client = await Client.findOne({_id: id});

    res.status(200).json({
        msg: "Updated client",
        client
    });
}

export const removedAdmin = async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndUpdate(id, {state: false});
    const adminDel = await Admin.findOne({_id: id});

    res.status(200).json({
        msg: "Removed Admin",
        adminDel
    });
}

export const removedClient = async (req, res) => {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(id, {state: false});
    const clientDel = await Client.findOne({_id: id});

    res.status(200).json({
        msg: "Removed client",
        clientDel
    });
}