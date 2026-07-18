import { prisma } from "../config/db.js";

export const create = async (data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      barcode: data.barcode,
      qrCode: data.qrCode,
      rentalPricePerDay: data.rentalPricePerDay,
      depositAmount: data.depositAmount,
      stockQuantity: data.stockQuantity,
      images: {
        create: data.images || []
      },
      variants: {
        create: data.variants || []
      }
    },
    include: {
      images: true,
      variants: true,
      category: true
    }
  });
};

export const findAll = async () => {
  return await prisma.product.findMany({
    include: {
      images: true,
      variants: true,
      category: true
    }
  });
};

export const findById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
      category: true
    }
  });
};

export const update = async (id, data) => {
  // Simple update for core fields. For images/variants, usually we would delete and recreate or upsert.
  return await prisma.product.update({
    where: { id },
    data,
    include: {
      images: true,
      variants: true
    }
  });
};

export const remove = async (id) => {
  return await prisma.product.delete({ where: { id } });
};

export const updateAvailability = async (id, isAvailable) => {
  return await prisma.product.update({
    where: { id },
    data: { isAvailable }
  });
};
