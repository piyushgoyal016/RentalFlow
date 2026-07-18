import * as productRepository from "../repositories/product.repository.js";
import ApiError from "../utils/ApiError.js";

export const createProduct = async (data) => {
  return await productRepository.create(data);
};

export const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await productRepository.findAll(skip, limit);
};

export const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const updateProduct = async (id, data) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return await productRepository.update(id, data);
};

export const deleteProduct = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return await productRepository.remove(id);
};

export const toggleProductAvailability = async (id, isAvailable) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return await productRepository.updateAvailability(id, isAvailable);
};
