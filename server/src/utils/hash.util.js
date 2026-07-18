import bcrypt from "bcrypt";
import { config } from "../config/env.js";

/**
 * Hash a plain text password using bcrypt.
 * @param {string} password - The plain text password
 * @returns {Promise<string>} The hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, config.bcrypt.saltRounds);
};

/**
 * Verify a plain text password against a hash.
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password stored in the database
 * @returns {Promise<boolean>} True if matching, false otherwise
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
