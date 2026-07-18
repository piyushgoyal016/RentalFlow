const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  async createCategory(data) {
    const existingCategory = await categoryRepository.findByName(data.name);
    if (existingCategory) {
      const error = new Error('Category with this name already exists');
      error.statusCode = 409;
      throw error;
    }
    return await categoryRepository.create(data);
  }

  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async updateCategory(id, data) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    if (data.name && data.name !== category.name) {
      const existingCategory = await categoryRepository.findByName(data.name);
      if (existingCategory) {
        const error = new Error('Category with this name already exists');
        error.statusCode = 409;
        throw error;
      }
    }
    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return await categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
