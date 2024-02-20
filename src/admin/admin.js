import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const AdminSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del administrador es obligatorio"]
    },
    correo: {
        type: String,
        required: [true, "El correo del administrador es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña del administrador es obligatorio"]
    },
    role: {
        type: String,
        default: "ADMIN"
    },
    estado: {
        type: boolean,
        default: true
    }
});

AdminSchema.methods.toJson = function(){
    const {__v, password, _id, ...admin } = this.toObject();
    admin.uid = _id;
    return admin;
}

export default mongoose.model('Admin', AdminSchema);