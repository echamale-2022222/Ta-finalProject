import { request, response } from "express";
import Category from "./category.model.js";

export const categoryPost = async (req = request, res = response) => {
    const { categoryName, categoryDescription } = req.body;
    const category = new Category({ categoryName, categoryDescription });

    await category.save();

    res.status(200).json({
        msg: "Category added to the database",
        category
    });
}

export const existingCategories = async (req, res) => {
    const query = {statusCategory: true};

    const [quantityCategories, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);
    
    res.status(200).json({
        msg: "The existing categories",
        quantityCategories,
        categories
    });
}

export const updateCategory = async (req, res = response) => {
    const { id } = req.params;
    const {_id, ...rest} = req.body;

    await Category.findByIdAndUpdate(id, rest);

    const category = await Category.findOne({_id: id});

    res.status(200).json({
        msg: 'Updated category',
        category
    });
}

export const deleteCategory = async (req, res) => {
    const {id} = req.params;

    const category = await Category.findByIdAndUpdate(id, {statusCategory: false});
    const categoryDel = await Category.findOne({_id: id});

    res.status(200).json({
        msg: "Deleted category",
        categoryDel
    });
}