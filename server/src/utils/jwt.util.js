import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

/**
 * Generate a short-lived access token
 * @param {object} payload - Custom data to embed in token (e.g. { id, role })
 * @returns {string} The signed JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

/**
 * Generate a long-lived refresh token
 * @param {object} payload - Custom data to embed in token
 * @returns {string} The signed JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify an access token
 * @param {string} token - The access token string
 * @returns {object} The decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret);
};

/**
 * Verify a refresh token
 * @param {string} token - The refresh token string
 * @returns {object} The decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};
