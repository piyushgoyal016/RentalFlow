import * as categoryRepository from "../repositories/category.repository.js";
import ApiError from "../utils/ApiError.js";

export const createCategory = async (data) => {
  const existingCategory = await categoryRepository.findByName(data.name);
  if (existingCategory) {
    throw new ApiError(409, "Category with this name already exists");
  }
  return await categoryRepository.create(data);
};

export const getAllCategories = async () => {
  return await categoryRepository.findAll();
};

export const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};

export const updateCategory = async (id, data) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  if (data.name && data.name !== category.name) {
    const existingCategory = await categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists");
    }
  }
  return await categoryRepository.update(id, data);
};

export const deleteCategory = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return await categoryRepository.remove(id);
};
