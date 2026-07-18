import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (data) => {
  return await prisma.lateFee.create({
    data
  });
};

export const findById = async (id) => {
  return await prisma.lateFee.findUnique({
    where: { id },
    include: { returnInspection: true }
  });
};

export const markAsPaid = async (id) => {
  return await prisma.lateFee.update({
    where: { id },
    data: { isPaid: true }
  });
};

export const findAll = async () => {
  return await prisma.lateFee.findMany({
    include: { returnInspection: true }
  });
};
