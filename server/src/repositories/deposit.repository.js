import { prisma } from "../config/db.js";

export const create = async (data) => {
  return await prisma.securityDeposit.create({
    data
  });
};

export const findById = async (id) => {
  return await prisma.securityDeposit.findUnique({
    where: { id },
    include: { rentalOrder: true }
  });
};

export const findByRentalOrderId = async (rentalOrderId) => {
  return await prisma.securityDeposit.findUnique({
    where: { rentalOrderId }
  });
};

export const findAll = async () => {
  return await prisma.securityDeposit.findMany({
    include: { rentalOrder: true }
  });
};

export const processRefund = async (id, refundAmount) => {
  return await prisma.securityDeposit.update({
    where: { id },
    data: {
      isRefunded: true,
      refundAmount
    }
  });
};
