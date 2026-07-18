import { prisma } from "../config/db.js";

/**
 * Find user by email, including role details
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });
};

/**
 * Find user by ID, including role details
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  });
};

/**
 * Create a new user in the database
 * @param {object} userData
 * @returns {Promise<object>}
 */
export const createUser = async (userData) => {
  return prisma.user.create({
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || null,
      roleId: userData.roleId,
    },
    include: {
      role: true,
    },
  });
};

/**
 * Find a role by its unique name (e.g. "ADMIN", "CUSTOMER")
 * @param {string} name
 * @returns {Promise<object|null>}
 */
export const findRoleByName = async (name) => {
  return prisma.role.findUnique({
    where: { name },
  });
};
