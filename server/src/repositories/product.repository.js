import { prisma } from "../config/db.js";

export const create = async (data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      vendorId: data.vendorId || null,
      barcode: data.barcode,
      qrCode: data.qrCode,
      rentalPricePerDay: data.rentalPricePerDay,
      depositAmount: data.depositAmount,
      stockQuantity: data.stockQuantity,
      isPublished: data.isPublished || false,
      lateFeeEnabled: data.lateFeeEnabled !== undefined ? data.lateFeeEnabled : true,
      lateFeeRate: data.lateFeeRate || null,
      paddingTime: data.paddingTime || 0,
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
      category: true,
      vendor: true
    }
  });
};

export const findAll = async (skip = 0, take = 10) => {
  const where = {
    barcode: {
      notIn: ['SECURITY_DEPOSIT_SERVICE', 'LATE_FEES_SERVICE']
    }
  };
  const [data, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        rentalPricePerDay: true,
        depositAmount: true,
        isPublished: true,
        isAvailable: true,
        category: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return { data, totalCount };
};

export const findById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      variants: true,
      category: true,
      vendor: true
    }
  });
};

export const update = async (id, data) => {
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
