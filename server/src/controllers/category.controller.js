import * as categoryService from "../services/category.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);
    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
  } catch (error) {
    next(error);
  }
};
