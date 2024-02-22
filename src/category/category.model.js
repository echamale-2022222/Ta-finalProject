import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    categoryName:{
        type: String,
        required: [true, "The category name is required"],
        unique: true
    },
    categoryDescription:{
        type: String,
        required: [true, "The category description is mandatory"]
    },
    statusCategory:{
        type: Boolean,
        default: true
    }
});

CategorySchema.methods.toJSON = function(){
    const { __v, _id, ...category} = this.toObject();
    category.uid = _id;
    return category;
}
  
export default mongoose.model('Category', CategorySchema);