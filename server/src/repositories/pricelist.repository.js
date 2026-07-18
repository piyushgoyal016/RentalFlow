import { prisma } from "../config/db.js";

export const createPricelist = async (data) => {
  return await prisma.pricelist.create({
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive !== undefined ? data.isActive : true,
      rules: {
        create: data.rules || []
      }
    },
    include: {
      rules: true
    }
  });
};

export const findAll = async () => {
  return await prisma.pricelist.findMany({
    include: {
      rules: {
        include: {
          product: true,
          category: true
        }
      }
    }
  });
};

export const findById = async (id) => {
  return await prisma.pricelist.findUnique({
    where: { id },
    include: {
      rules: {
        include: {
          product: true,
          category: true
        }
      }
    }
  });
};

export const updatePricelist = async (id, data) => {
  // If rules are provided in update, we recreate them to keep it clean
  const updatePayload = {
    name: data.name,
    description: data.description,
    isActive: data.isActive
  };

  if (data.rules) {
    return await prisma.$transaction(async (tx) => {
      // Delete existing rules
      await tx.pricelistRule.deleteMany({
        where: { pricelistId: id }
      });

      // Update and create new rules
      return await tx.pricelist.update({
        where: { id },
        data: {
          ...updatePayload,
          rules: {
            create: data.rules
          }
        },
        include: {
          rules: true
        }
      });
    });
  }

  return await prisma.pricelist.update({
    where: { id },
    data: updatePayload,
    include: {
      rules: true
    }
  });
};

export const deletePricelist = async (id) => {
  return await prisma.pricelist.delete({
    where: { id }
  });
};

// Resolve active pricing rules for a product/category context
export const findActiveRules = async (productId, categoryId) => {
  return await prisma.pricelistRule.findMany({
    where: {
      pricelist: {
        isActive: true
      },
      OR: [
        { productId },
        { categoryId },
        { productId: null, categoryId: null } // Global fallback rules
      ]
    },
    include: {
      pricelist: true
    },
    orderBy: [
      { productId: 'desc' }, // specific product rules first
      { categoryId: 'desc' } // category rules second
    ]
  });
};
