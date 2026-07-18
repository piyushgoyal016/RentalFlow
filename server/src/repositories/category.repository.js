import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); // In a real app, import from a singleton config/db.js

export const create = async (data) => {
  return await prisma.category.create({ data });
};

export const findAll = async () => {
  return await prisma.category.findMany();
};

export const findById = async (id) => {
  return await prisma.category.findUnique({ where: { id } });
};

export const update = async (id, data) => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.category.delete({ where: { id } });
};

export const findByName = async (name) => {
  return await prisma.category.findFirst({ where: { name } });
};
