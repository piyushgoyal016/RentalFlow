import * as productService from "../services/product.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.user);
    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const products = await productService.getAllProducts(page, limit);
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body, req.user);
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id, req.user);
    return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;
    const product = await productService.toggleProductAvailability(id, isAvailable, req.user);
    return res.status(200).json(new ApiResponse(200, product, "Product availability updated"));
  } catch (error) {
    next(error);
  }
};
