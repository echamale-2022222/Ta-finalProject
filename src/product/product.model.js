import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    productName:{
        type: String,
        required: [true, "Product name is required"],
        unique: true
    },
    productDescription:{
        type: String,
        required: [true, "Product description is mandatory"]
    },
    productPrice:{
        type: Number,
        required: [true, "Product price is required"]
    },
    productCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    supplier:{
        type: String,
        required: [true, "The product source is obligatory"]
    },
    stock:{
        type: Number,
        required: [true, "The stock of the product is obligatory"]
    },
    timesBought:{
        type: Number,
        default: 0
    },
    availability:{
        type: Boolean,
        default: true
    }
});

ProductSchema.methods.toJSON = function(){
    const { __v, _id, availability, timesBought, stock, supplier, ...product} = this.toObject();
    product.uid = _id;
    return product;
}

export default mongoose.model('Product', ProductSchema);