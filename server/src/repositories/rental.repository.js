import { prisma } from "../config/db.js";

export const createRentalOrder = async (data) => {
  return await prisma.rentalOrder.create({
    data: {
      userId: data.userId,
      pickupDate: new Date(data.pickupDate),
      returnDate: new Date(data.returnDate),
      totalCost: data.totalCost,
      status: "PENDING",
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerDay: item.pricePerDay
        }))
      }
    },
    include: {
      items: true
    }
  });
};

export const findById = async (id) => {
  return await prisma.rentalOrder.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      user: true,
      payment: true,
      deposit: true
    }
  });
};

export const findAll = async (userId, role) => {
  const where = role === "CUSTOMER" ? { userId } : {};
  return await prisma.rentalOrder.findMany({
    where,
    include: {
      items: {
        include: { product: true }
      },
      user: true
    }
  });
};

export const updateStatus = async (id, status) => {
  return await prisma.rentalOrder.update({
    where: { id },
    data: { status }
  });
};
