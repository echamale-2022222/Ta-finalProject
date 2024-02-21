import mongoose from 'mongoose';

const ClientSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligaroria"],
  },
  role: {
    type: String,
    default: "CLIENT"
  },
  estado: {
    type: Boolean,
    default: true,
  }
});

ClientSchema.methods.toJSON = function(){
  const { __v, password, _id, ...client} = this.toObject();
  client.uid = _id;
  return client;
}

export default mongoose.model('Client', ClientSchema);