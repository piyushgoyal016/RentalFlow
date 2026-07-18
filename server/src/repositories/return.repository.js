import { prisma } from "../config/db.js";

export const createReturnWithRestock = async (inspectionData, itemsToReturn, lateFeeData = null) => {
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

    // 2. Process Late Fee if applicable
    if (lateFeeData && lateFeeData.penaltyAmount > 0) {
      // Create LateFee record
      await tx.lateFee.create({
        data: {
          returnInspectionId: inspection.id,
          daysLate: lateFeeData.hoursLate, // Storing hours late
          penaltyAmount: lateFeeData.penaltyAmount,
          isPaid: false
        }
      });

      // Add Late Fees product as a line item on the order
      await tx.rentalItem.create({
        data: {
          rentalOrderId: inspectionData.rentalOrderId,
          productId: lateFeeData.productId,
          quantity: 1,
          pricePerDay: lateFeeData.penaltyAmount
        }
      });

      // Update rental status and increment total costs
      await tx.rentalOrder.update({
        where: { id: inspectionData.rentalOrderId },
        data: {
          status: "COMPLETED",
          totalCost: {
            increment: lateFeeData.penaltyAmount
          },
          finalCost: {
            increment: lateFeeData.penaltyAmount
          }
        }
      });
    } else {
      // Update rental status normally
      await tx.rentalOrder.update({
        where: { id: inspectionData.rentalOrderId },
        data: { status: "COMPLETED" }
      });
    }

    // 3. Increment stock for returned items (only non-service items)
    for (const item of itemsToReturn) {
      // Check if product is a service
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { category: true }
      });
      
      if (product && product.category.name !== "Services") {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity
            }
          }
        });
      }
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
