/**
 * @file auth.validator.js
 * @description Validation rules for authentication requests.
 */

export const registerSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Must be a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters long",
  },
  firstName: {
    required: true,
    minLength: 2,
    message: "First name must be at least 2 characters long",
  },
  lastName: {
    required: true,
    minLength: 2,
    message: "Last name must be at least 2 characters long",
  },
  phone: {
    required: false,
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: "Must be a valid E.164 phone number",
  },
};

export const loginSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Must be a valid email address",
  },
  password: {
    required: true,
    message: "Password is required",
  },
};
