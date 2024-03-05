import { request, response } from "express";
import Category from "./category.model.js";
import Product from "../product/product.model.js";

export const categoryPost = async (req = request, res = response) => {
    const admin = req.admin.role;

    if (admin !== 'ADMIN') {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else {
        const { categoryName, categoryDescription } = req.body;
        const category = new Category({ categoryName, categoryDescription });

        await category.save();

        res.status(200).json({
            msg: "Category added to the database",
            category
        });
    }

}

export const existingCategories = async (req, res) => {
    const query = { statusCategory: true };

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
    const { _id, ...rest } = req.body;
    const admin = req.admin.role;

    if (admin !== 'ADMIN') {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else {
        await Category.findByIdAndUpdate(id, rest);
        const category = await Category.findOne({ _id: id });

        res.status(200).json({
            msg: 'Updated category',
            category
        });
    }
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const admin = req.admin.role;

    if (admin !== 'ADMIN') {
        return res.status(401).json({
            msg: "You don't have the necessary permissions"
        });
    } else {
        let alternativeCategory;

        alternativeCategory = await Category.findOne({ categoryName: "Not assigned" });

        if (!alternativeCategory) {
            alternativeCategory = await Category.create({
                categoryName: "Not assigned",
                categoryDescription: "This category is assigned to products that do not have a category"
            });
        }

        await Product.updateMany({ productCategory: id }, { productCategory: alternativeCategory._id });

        await Category.findByIdAndUpdate(id, { statusCategory: false });
        const category = await Category.findById(id);

        res.status(200).json({
            msg: "Deleted category",
            category
        });
    }
}