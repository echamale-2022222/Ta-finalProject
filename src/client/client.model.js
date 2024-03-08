import mongoose from 'mongoose';

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  mail: {
    type: String,
    required: [true, "Email is mandatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  role: {
    type: String,
    default: "CLIENT"
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  state: {
    type: Boolean,
    default: true
  }
});

ClientSchema.methods.toJSON = function(){
  const { __v, password, _id, ...client} = this.toObject();
  client.uid = _id;
  return client;
}

export default mongoose.model('Client', ClientSchema);