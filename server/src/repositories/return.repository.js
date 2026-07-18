import { prisma } from "../config/db.js";

export const create = async (data) => {
  return await prisma.returnInspection.create({
    data
  });
};

export const findById = async (id) => {
  return await prisma.returnInspection.findUnique({
    where: { id },
    include: { rentalOrder: true, lateFee: true }
  });
};

export const findByRentalOrderId = async (rentalOrderId) => {
  return await prisma.returnInspection.findUnique({
    where: { rentalOrderId }
  });
};

export const findAll = async () => {
  return await prisma.returnInspection.findMany({
    include: { rentalOrder: true }
  });
};
