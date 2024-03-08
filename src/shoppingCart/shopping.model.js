import mongoose from "mongoose";

const ShoppingSchema = mongoose.Schema({
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number
        },
        subTotal: {
            type: Number
        }
    }],
    total: {
        type: Number
    }
});

export default mongoose.model('ShoppingCart', ShoppingSchema);