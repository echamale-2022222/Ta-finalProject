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