import { prisma } from "../config/db.js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // ── Core KPI queries (parallel) ────────────────────────────────────────────
  const [
    activeRentals,
    customerCount,
    productCount,
    totalRevenue,
    depositsHeld,
    totalLateFees,
    dueToday,
    recentOrders,
    allPayments,
    categoryOrders,
    topProductsRaw,
    auditLogs,
    upcomingPickups,
  ] = await Promise.all([
    prisma.rentalOrder.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: { name: "CUSTOMER" } } }),
    prisma.product.count({
      where: { barcode: { notIn: ["SECURITY_DEPOSIT_SERVICE", "LATE_FEES_SERVICE"] } }
    }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    prisma.securityDeposit.aggregate({ _sum: { amount: true }, where: { isRefunded: false } }),
    prisma.lateFee.aggregate({ _sum: { penaltyAmount: true }, where: { isPaid: false } }),
    prisma.rentalOrder.count({
      where: { returnDate: { gte: today, lt: tomorrow }, status: "ACTIVE" }
    }),
    // Recent orders for timeline
    prisma.rentalOrder.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true } }, items: { include: { product: { select: { name: true } } } } },
    }),
    // All completed payments for revenue chart (last 12 months)
    prisma.payment.findMany({
      where: { status: "COMPLETED", createdAt: { gte: new Date(Date.now() - 365 * 86_400_000) } },
      select: { amount: true, createdAt: true },
    }),
    // Category distribution
    prisma.rentalItem.findMany({
      include: { product: { include: { category: { select: { name: true } } } } },
    }),
    // Top products by rental count
    prisma.rentalItem.groupBy({
      by: ["productId"],
      _count: { productId: true },
      _sum:   { pricePerDay: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    // Audit log for activity timeline
    prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    // Upcoming pickups & returns (next 7 days)
    prisma.rentalOrder.findMany({
      where: {
        status: { in: ["ACTIVE", "PENDING"] },
        OR: [
          { pickupDate: { gte: today, lt: new Date(Date.now() + 7 * 86_400_000) } },
          { returnDate: { gte: today, lt: new Date(Date.now() + 7 * 86_400_000) } },
        ],
      },
      take: 5,
      orderBy: { returnDate: "asc" },
      include: {
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
  ]);

  // ── Revenue chart: group by month using createdAt on both orders and payments ─
  const monthlyMap = {};
  MONTHS.forEach((m) => { monthlyMap[m] = { month: m, revenue: 0, rentals: 0 }; });

  // Count ALL orders by month (including future pending)
  for (const o of recentOrdersAll) {
    const m = MONTHS[new Date(o.createdAt).getMonth()];
    if (monthlyMap[m]) monthlyMap[m].rentals += 1;
  }

  // Sum COMPLETED payments by month for revenue
  for (const p of allPayments) {
    const m = MONTHS[new Date(p.createdAt).getMonth()];
    if (monthlyMap[m]) monthlyMap[m].revenue += p.amount;
  }

  const revenueChart = Object.values(monthlyMap);


  // ── Category pie chart ─────────────────────────────────────────────────────
  const catMap = {};
  for (const item of categoryOrders) {
    const name = item.product?.category?.name || "Uncategorized";
    if (name === "Services") continue;
    catMap[name] = (catMap[name] || 0) + item.quantity;
  }
  const categoryChart = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // ── Top products ───────────────────────────────────────────────────────────
  const topProducts = await Promise.all(
    topProductsRaw.map(async (r) => {
      const prod = await prisma.product.findUnique({
        where: { id: r.productId },
        select: { name: true, rentalPricePerDay: true },
      });
      const reviews = await prisma.review.aggregate({
        where: { productId: r.productId }, _avg: { rating: true },
      });
      return {
        name:    prod?.name || "Unknown",
        rentals: r._count.productId,
        revenue: (r._sum.pricePerDay || 0) * r._count.productId,
        rating:  (reviews._avg?.rating || 0).toFixed(1),
      };
    })
  );

  // ── Activity timeline ─────────────────────────────────────────────────────
  const statusColors = { COMPLETED: "green", ACTIVE: "blue", OVERDUE: "red", PENDING: "yellow", CANCELLED: "gray" };
  const timeline = [
    ...recentOrders.map((o) => ({
      id:      o.id,
      type:    "order",
      color:   statusColors[o.status] || "blue",
      title:   `${o.user?.firstName} ${o.user?.lastName} — ${o.status}`,
      subtitle: o.items[0]?.product?.name || "Rental order",
      time:    o.createdAt,
    })),
    ...auditLogs.map((a) => ({
      id:      a.id,
      type:    "audit",
      color:   "purple",
      title:   a.action.replace(/_/g, " "),
      subtitle: a.details || a.entity,
      time:    a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 8);

  // ── Upcoming schedule ─────────────────────────────────────────────────────
  const schedule = upcomingPickups.map((o) => {
    const isReturn = o.returnDate >= today && o.returnDate < new Date(Date.now() + 7 * 86_400_000);
    return {
      id:         o.id,
      type:       isReturn ? "return" : "pickup",
      customer:   `${o.user?.firstName} ${o.user?.lastName}`,
      product:    o.items[0]?.product?.name || "Item",
      date:       isReturn ? o.returnDate : o.pickupDate,
      status:     o.status,
    };
  });

  return {
    activeRentals,
    customerCount,
    productCount,
    revenue:         totalRevenue._sum?.amount    || 0,
    depositsHeld:    depositsHeld._sum?.amount    || 0,
    lateFeesPending: totalLateFees._sum?.penaltyAmount || 0,
    dueToday,
    upcomingReturns: dueToday,
    // Chart data
    revenueChart,
    categoryChart,
    topProducts,
    timeline,
    schedule,
  };
};
