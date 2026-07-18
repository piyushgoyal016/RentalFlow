import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getDashboardStats = async () => {
  const [
    activeRentals,
    customerCount,
    productCount,
    totalRevenue,
    depositsHeld,
    totalLateFees
  ] = await Promise.all([
    prisma.rentalOrder.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: { name: "CUSTOMER" } } }),
    prisma.product.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    prisma.securityDeposit.aggregate({ _sum: { amount: true }, where: { isRefunded: false } }),
    prisma.lateFee.aggregate({ _sum: { penaltyAmount: true }, where: { isPaid: false } })
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueToday = await prisma.rentalOrder.count({
    where: {
      returnDate: {
        gte: today,
        lt: tomorrow
      },
      status: "ACTIVE"
    }
  });

  return {
    activeRentals,
    customerCount,
    productCount,
    revenue: totalRevenue._sum.amount || 0,
    depositsHeld: depositsHeld._sum.amount || 0,
    lateFeesPending: totalLateFees._sum.penaltyAmount || 0,
    dueToday,
    upcomingReturns: dueToday // simplified
  };
};
