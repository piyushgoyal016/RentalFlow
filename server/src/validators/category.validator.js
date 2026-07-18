export const createCategorySchema = {
  name: {
    required: true,
    minLength: 3,
    message: "Name must be at least 3 characters long",
  },
  description: {
    required: false,
  },
  isActive: {
    required: false,
  },
};

export const updateCategorySchema = {
  name: {
    required: false,
    minLength: 3,
  },
  description: {
    required: false,
  },
  isActive: {
    required: false,
  },
};
