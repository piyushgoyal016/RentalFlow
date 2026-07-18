const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { validateCreateCategory, validateUpdateCategory } = require('../validators/category.validator');

// Note: Ensure that `authenticate` and `authorize` match the existing authentication middleware implementation
// If they are located elsewhere, adjust the paths accordingly.
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Create a category (Admin only)
router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  validateCreateCategory,
  categoryController.createCategory
);

// Get all categories (Public or authenticated as needed)
router.get(
  '/',
  categoryController.getAllCategories
);

// Get category by ID
router.get(
  '/:id',
  categoryController.getCategoryById
);

// Update a category (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  validateUpdateCategory,
  categoryController.updateCategory
);

// Delete a category (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  categoryController.deleteCategory
);

module.exports = router;
