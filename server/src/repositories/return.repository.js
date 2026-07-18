import { prisma } from "../config/db.js";

export const createReturnWithRestock = async (inspectionData, itemsToReturn) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create return inspection
    const inspection = await tx.returnInspection.create({
      data: {
        rentalOrderId: inspectionData.rentalOrderId,
        isDamaged: inspectionData.isDamaged,
        damageReport: inspectionData.damageReport,
        missingAccessories: inspectionData.missingAccessories
      }
    });

    // 2. Update rental status
    await tx.rentalOrder.update({
      where: { id: inspectionData.rentalOrderId },
      data: { status: "COMPLETED" }
    });

    // 3. Increment stock for returned items
    for (const item of itemsToReturn) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      });
    }

    return inspection;
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

export const findAll = async (skip = 0, take = 10) => {
  const [data, totalCount] = await Promise.all([
    prisma.returnInspection.findMany({
      skip,
      take,
      include: { rentalOrder: true },
      orderBy: { returnedAt: 'desc' }
    }),
    prisma.returnInspection.count()
  ]);

  return { data, totalCount };
};
