import { prisma } from "../config/db.js";

export const createRentalOrder = async (data) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the rental order
    const order = await tx.rentalOrder.create({
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

    // 2. Decrement stock for each product
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      });
    }

    return order;
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

export const findAll = async (userId, role, skip = 0, take = 10) => {
  const where = role === "CUSTOMER" ? { userId } : {};
  
  const [data, totalCount] = await Promise.all([
    prisma.rentalOrder.findMany({
      where,
      skip,
      take,
      include: {
        items: {
          include: { product: true }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.rentalOrder.count({ where })
  ]);
  
  return { data, totalCount };
};

export const updateStatus = async (id, status) => {
  return await prisma.rentalOrder.update({
    where: { id },
    data: { status }
  });
};
