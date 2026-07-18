import * as productRepository from "../repositories/product.repository.js";
import ApiError from "../utils/ApiError.js";

export const createProduct = async (data, user) => {
  // If role is VENDOR, force vendorId to be the logged-in user
  if (user.role.name === "VENDOR") {
    data.vendorId = user.id;
    data.isPublished = false; // Only admin can publish
  } else if (user.role.name !== "ADMIN") {
    // Other roles cannot create products
    throw new ApiError(403, "You do not have permission to create products");
  }

  // Admin can optionally set isPublished or assign to a vendorId in data
  return await productRepository.create(data);
};

export const getAllProducts = async (page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit;
  
  // If we want to filter by vendor (e.g. for segregated queries)
  // we can handle this later in reports or general catalog queries.
  // By default, catalog is open, but only published products might be visible to customers.
  // Wait, let's keep findAll generic but allow filtering if passed.
  if (filter.vendorId) {
    // Add specific queries if needed or query in repository.
    // Let's keep it simple: if filtering, repositories can handle it.
  }
  return await productRepository.findAll(skip, limit);
};

export const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const updateProduct = async (id, data, user) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Role based checks
  if (user.role.name === "VENDOR") {
    if (product.vendorId !== user.id) {
      throw new ApiError(403, "You can only update your own products");
    }
    // Prevent vendor from publishing
    delete data.isPublished;
  } else if (user.role.name !== "ADMIN" && user.role.name !== "MANAGER") {
    throw new ApiError(403, "You do not have permission to update products");
  }

  return await productRepository.update(id, data);
};

export const deleteProduct = async (id, user) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Role based checks
  if (user.role.name === "VENDOR") {
    if (product.vendorId !== user.id) {
      throw new ApiError(403, "You can only delete your own products");
    }
  } else if (user.role.name !== "ADMIN") {
    throw new ApiError(403, "You do not have permission to delete products");
  }

  return await productRepository.remove(id);
};

export const toggleProductAvailability = async (id, isAvailable, user) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Role based checks
  if (user.role.name === "VENDOR") {
    if (product.vendorId !== user.id) {
      throw new ApiError(403, "You can only toggle availability for your own products");
    }
  } else if (user.role.name !== "ADMIN" && user.role.name !== "MANAGER") {
    throw new ApiError(403, "You do not have permission to modify products");
  }

  return await productRepository.updateAvailability(id, isAvailable);
};
