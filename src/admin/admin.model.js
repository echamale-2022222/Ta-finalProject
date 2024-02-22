import mongoose from "mongoose";

const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Administrator name is required"]
    },
    mail: {
        type: String,
        required: [true, "Administrator email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Administrator password is required"]
    },
    role: {
        type: String,
        default: "ADMIN"
    },
    state: {
        type: Boolean,
        default: true
    }
});

AdminSchema.methods.toJSON = function(){
    const { __v, password, _id, ...admin} = this.toObject();
    admin.uid = _id;
    return admin;
}

export default mongoose.model('Admin', AdminSchema);