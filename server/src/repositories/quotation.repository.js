import { prisma } from "../config/db.js";

export const findAll = async () => {
  return await prisma.quotationTemplate.findMany({
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });
};

export const findById = async (id) => {
  return await prisma.quotationTemplate.findUnique({ where: { id } });
};

export const create = async (data) => {
  // If this is marked as default, unset others
  if (data.isDefault) {
    await prisma.quotationTemplate.updateMany({ data: { isDefault: false } });
  }
  return await prisma.quotationTemplate.create({ data });
};

export const update = async (id, data) => {
  if (data.isDefault) {
    await prisma.quotationTemplate.updateMany({
      where: { id: { not: id } },
      data: { isDefault: false }
    });
  }
  return await prisma.quotationTemplate.update({ where: { id }, data });
};

export const remove = async (id) => {
  return await prisma.quotationTemplate.delete({ where: { id } });
};
