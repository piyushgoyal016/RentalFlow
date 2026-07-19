import { prisma } from "../config/db.js";

export const getDashboardStats = async () => {
  const activeRentals = await prisma.rentalOrder.count({ where: { status: "ACTIVE" } });
  const customerCount = await prisma.user.count({ where: { role: { name: "CUSTOMER" } } });
  const productCount = await prisma.product.count();
  const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } });
  const depositsHeld = await prisma.securityDeposit.aggregate({ _sum: { amount: true }, where: { isRefunded: false } });
  const totalLateFees = await prisma.lateFee.aggregate({ _sum: { penaltyAmount: true }, where: { isPaid: false } });

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
    revenue: totalRevenue._sum?.amount || 0,
    depositsHeld: depositsHeld._sum?.amount || 0,
    lateFeesPending: totalLateFees._sum?.penaltyAmount || 0,
    dueToday,
    upcomingReturns: dueToday // simplified
  };
};
