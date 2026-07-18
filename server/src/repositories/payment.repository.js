import { prisma } from "../config/db.js";

export const create = async (data) => {
  return await prisma.payment.create({
    data
  });
};

export const findById = async (id) => {
  return await prisma.payment.findUnique({
    where: { id },
    include: { rentalOrder: true }
  });
};

export const findByRentalOrderId = async (rentalOrderId) => {
  return await prisma.payment.findUnique({
    where: { rentalOrderId }
  });
};

export const updateStatus = async (id, status, invoiceUrl = null) => {
  const data = { status };
  if (invoiceUrl) data.invoiceUrl = invoiceUrl;
  
  return await prisma.payment.update({
    where: { id },
    data
  });
};

export const refund = async (id) => {
  return await prisma.payment.update({
    where: { id },
    data: { status: "REFUNDED" }
  });
};
