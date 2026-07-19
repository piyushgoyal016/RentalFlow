/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║   RENTFLOW — 12-Month Revenue Booster Seeder          ║
 * ║   Spreads 120+ paid orders across the entire year     ║
 * ║   to fill every month in the Revenue Overview chart.  ║
 * ╚═══════════════════════════════════════════════════════╝
 */
import { prisma } from "../src/config/db.js";

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rnd(0, arr.length - 1)];

// Returns a date in the given month of the current year
function dateInMonth(monthIndex, dayOffset = 0) {
  const d = new Date();
  d.setMonth(monthIndex);
  d.setDate(rnd(1, 25) + dayOffset);
  d.setHours(rnd(8, 18), 0, 0, 0);
  // Keep months in the past; future months stay as future
  return d;
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📅  12-Month Revenue Booster Seeder");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // ─── Fetch existing data ────────────────────────────────────────────────────
  const [customers, products] = await Promise.all([
    prisma.user.findMany({ where: { role: { name: "CUSTOMER" } } }),
    prisma.product.findMany({
      where: { isPublished: true, barcode: { notIn: ["SECURITY_DEPOSIT_SERVICE", "LATE_FEES_SERVICE"] } }
    }),
  ]);

  if (customers.length === 0 || products.length === 0) {
    console.error("❌ No customers or products found. Run mock_seed.js first.");
    process.exit(1);
  }

  console.log(`   Found ${customers.length} customers, ${products.length} products`);

  // ─── Revenue targets per month (realistic seasonality) ─────────────────────
  // Index 0 = Jan, 11 = Dec
  const monthTargets = [
    { month: 0,  label: "Jan", orders: 8,  priceMultiplier: 0.85 }, // Post-holiday dip
    { month: 1,  label: "Feb", orders: 9,  priceMultiplier: 0.90 }, // Valentine events
    { month: 2,  label: "Mar", orders: 11, priceMultiplier: 1.00 }, // Holi season
    { month: 3,  label: "Apr", orders: 10, priceMultiplier: 1.05 }, // New year events
    { month: 4,  label: "May", orders: 12, priceMultiplier: 1.10 }, // Summer uptick
    { month: 5,  label: "Jun", orders: 14, priceMultiplier: 1.15 }, // Summer peak
    { month: 6,  label: "Jul", orders: 5,  priceMultiplier: 1.20 }, // Current (already has data)
    { month: 7,  label: "Aug", orders: 7,  priceMultiplier: 1.10 }, // Independence Day
    { month: 8,  label: "Sep", orders: 9,  priceMultiplier: 1.05 }, // Festival prep
    { month: 9,  label: "Oct", orders: 15, priceMultiplier: 1.25 }, // Diwali peak 🪔
    { month: 10, label: "Nov", orders: 13, priceMultiplier: 1.20 }, // Post-Diwali
    { month: 11, label: "Dec", orders: 11, priceMultiplier: 1.30 }, // Christmas / New Year
  ];

  const currentMonth = new Date().getMonth();
  let totalCreated = 0;

  for (const { month, label, orders, priceMultiplier } of monthTargets) {
    const isFuture = month > currentMonth;

    let created = 0;
    for (let i = 0; i < orders; i++) {
      const customer = pick(customers);
      const product  = pick(products);
      const days     = rnd(2, 7);

      // Build pickup date in this month
      const pickupDate = dateInMonth(month);
      const returnDate = new Date(pickupDate.getTime() + days * 86_400_000);

      const status = isFuture
        ? pick(["PENDING", "PENDING", "ACTIVE"])
        : pick(["COMPLETED", "COMPLETED", "COMPLETED", "ACTIVE", "OVERDUE"]);

      const cost = Math.round(product.rentalPricePerDay * days * priceMultiplier);
      const paid = status === "COMPLETED" || (status === "ACTIVE" && !isFuture);

      try {
        const order = await prisma.rentalOrder.create({
          data: {
            userId: customer.id,
            status,
            pickupDate,
            returnDate,
            totalCost:      cost,
            finalCost:      cost,
            discountAmount: 0,
            createdAt:      pickupDate, // stamp to this month
            items: {
              create: [{ productId: product.id, quantity: 1, pricePerDay: product.rentalPricePerDay }],
            },
          },
        });

        if (paid) {
          await prisma.payment.create({
            data: {
              rentalOrderId: order.id,
              amount: cost,
              status: "COMPLETED",
              createdAt: pickupDate, // stamp payment to same month
            },
          });
        }

        if (product.depositAmount > 0 && paid) {
          await prisma.securityDeposit.create({
            data: {
              rentalOrderId: order.id,
              amount: product.depositAmount,
              isRefunded: status === "COMPLETED",
              refundAmount: status === "COMPLETED" ? product.depositAmount : null,
            },
          });
        }

        if (status === "COMPLETED") {
          await prisma.returnInspection.create({
            data: {
              rentalOrderId: order.id,
              returnedAt: returnDate,
              isDamaged: rnd(0, 6) === 0,
              damageReport: rnd(0, 6) === 0 ? "Minor surface scratches noted during inspection" : null,
            },
          });
        }

        if (status === "OVERDUE" && !isFuture) {
          const overdueDays = rnd(1, 4);
          const inspection = await prisma.returnInspection.create({
            data: {
              rentalOrderId: order.id,
              returnedAt: new Date(returnDate.getTime() + overdueDays * 86_400_000),
              isDamaged: false,
            },
          });
          await prisma.lateFee.create({
            data: {
              returnInspectionId: inspection.id,
              daysLate:      overdueDays,
              penaltyAmount: 150 * 24 * overdueDays,
              isPaid: false,
            },
          });
        }

        created++;
      } catch (_) {
        // skip errors silently and continue
      }
    }

    totalCreated += created;
    console.log(`  ✅ ${label}: ${created} orders created`);
  }

  // ─── Final stats ────────────────────────────────────────────────────────────
  const [orderCount, paymentAgg, activeCount, overdueCount] = await Promise.all([
    prisma.rentalOrder.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    prisma.rentalOrder.count({ where: { status: "ACTIVE" } }),
    prisma.rentalOrder.count({ where: { status: "OVERDUE" } }),
  ]);

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🎉  Done! Added ${totalCreated} new orders across all 12 months`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  📋 Total Orders  : ${orderCount}`);
  console.log(`  💰 Total Revenue : ₹${paymentAgg._sum?.amount?.toLocaleString() || 0}`);
  console.log(`  🟢 Active        : ${activeCount}`);
  console.log(`  🔴 Overdue       : ${overdueCount}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
