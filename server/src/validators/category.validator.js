const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().optional().allow(null, ''),
  isActive: Joi.boolean().optional()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().optional().allow(null, ''),
  isActive: Joi.boolean().optional()
});

const validateCreateCategory = (req, res, next) => {
  const { error } = createCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { error } = updateCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateCategory,
  validateUpdateCategory
};
