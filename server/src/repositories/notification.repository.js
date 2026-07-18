import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (data) => {
  return await prisma.notification.create({ data });
};

export const findAllByUserId = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

export const markAsRead = async (id) => {
  return await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
};
