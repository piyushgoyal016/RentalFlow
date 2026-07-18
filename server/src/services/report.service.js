import { prisma } from "../config/db.js";

export const generateRevenueReport = async () => {
  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
    include: { rentalOrder: true }
  });
  return payments;
};

export const generateRentalReport = async () => {
  return await prisma.rentalOrder.findMany({
    include: { user: true, items: { include: { product: true } } }
  });
};

export const generateCustomerReport = async () => {
  return await prisma.user.findMany({
    where: { role: { name: "CUSTOMER" } },
    include: { rentalOrders: true }
  });
};

export const generateProductReport = async () => {
  return await prisma.product.findMany({
    include: { category: true, rentalItems: true }
  });
};
