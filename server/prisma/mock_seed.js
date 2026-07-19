/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║   RENTFLOW — Rich Admin Showcase Mock Data Seeder        ║
 * ║   Adds: 6-month revenue history, 15+ customers,          ║
 * ║   50+ orders, audit logs, store locations, invoices,     ║
 * ║   late fees, notifications, reviews, and more.           ║
 * ╚══════════════════════════════════════════════════════════╝
 */
import { prisma } from "../src/config/db.js";
import bcrypt from "bcrypt";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rnd       = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick      = (arr) => arr[rnd(0, arr.length - 1)];
const daysAgo   = (d) => new Date(Date.now() - d * 86_400_000);
const daysFrom  = (d) => new Date(Date.now() + d * 86_400_000);
const monthsAgo = (m, day = 1) => {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  d.setDate(day);
  return d;
};

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎲  RentFlow — Full Admin Showcase Seeder");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const hp = await bcrypt.hash("Password123!", 10);

  // ─── Fetch existing base records ────────────────────────────────────────────
  const [rAdmin, rVendor, rCustomer, rManager] = await Promise.all([
    prisma.role.upsert({ where: { name: "ADMIN"    }, update: {}, create: { name: "ADMIN",    description: "System Administrator" } }),
    prisma.role.upsert({ where: { name: "VENDOR"   }, update: {}, create: { name: "VENDOR",   description: "Third-party Vendor" } }),
    prisma.role.upsert({ where: { name: "CUSTOMER" }, update: {}, create: { name: "CUSTOMER", description: "End Customer" } }),
    prisma.role.upsert({ where: { name: "MANAGER"  }, update: {}, create: { name: "MANAGER",  description: "Staff Manager" } }),
  ]);

  // ─── Admin & Manager ────────────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@hackathon.com" }, update: { password: hp },
    create: { firstName: "RentFlow", lastName: "Admin", email: "admin@hackathon.com", password: hp, roleId: rAdmin.id, isActive: true },
  });
  await prisma.user.upsert({
    where: { email: "manager@hackathon.com" }, update: {},
    create: { firstName: "Ankit", lastName: "Joshi", email: "manager@hackathon.com", password: hp, roleId: rManager.id, isActive: true },
  });
  console.log("✅ Admin/Manager users ready");

  // ─── Vendors ────────────────────────────────────────────────────────────────
  const vendor1 = await prisma.user.upsert({
    where: { email: "vendor@hackathon.com" }, update: { password: hp },
    create: { firstName: "Rajesh", lastName: "Kumar", email: "vendor@hackathon.com", password: hp, roleId: rVendor.id, isActive: true, companyName: "EasyRent Furniture", gstNo: "27BBBBB2222B2Z2", kycStatus: "VERIFIED" },
  });
  const vendor2 = await prisma.user.upsert({
    where: { email: "vendor2@hackathon.com" }, update: {},
    create: { firstName: "Priya", lastName: "Sharma", email: "vendor2@hackathon.com", password: hp, roleId: rVendor.id, isActive: true, companyName: "GadgetOnRent", gstNo: "27CCCCC3333C3Z3", kycStatus: "VERIFIED" },
  });
  const vendor3 = await prisma.user.upsert({
    where: { email: "vendor3@hackathon.com" }, update: {},
    create: { firstName: "Suresh", lastName: "Nair", email: "vendor3@hackathon.com", password: hp, roleId: rVendor.id, isActive: true, companyName: "EventMasters India", gstNo: "27DDDDD4444D4Z4", kycStatus: "VERIFIED" },
  });

  // ─── Store Locations ────────────────────────────────────────────────────────
  const storeLocations = [
    { vendorId: vendor1.id, name: "EasyRent – Koramangala",     street: "45, 4th Block",          city: "Bengaluru", state: "Karnataka", zipCode: "560034", isDefault: true,  isActive: true },
    { vendorId: vendor1.id, name: "EasyRent – Indiranagar",     street: "100 Ft Road, Indiranagar", city: "Bengaluru", state: "Karnataka", zipCode: "560038", isDefault: false, isActive: true },
    { vendorId: vendor2.id, name: "GadgetOnRent – Whitefield",  street: "ITPL Main Road",           city: "Bengaluru", state: "Karnataka", zipCode: "560066", isDefault: true,  isActive: true },
    { vendorId: vendor3.id, name: "EventMasters – Yeshwanthpur",street: "Near Orion Mall",          city: "Bengaluru", state: "Karnataka", zipCode: "560022", isDefault: true,  isActive: true },
  ];
  for (const loc of storeLocations) {
    await prisma.storeLocation.create({ data: loc }).catch(() => {}); // skip if already exists
  }

  console.log("✅ Store locations ready");

  // ─── 15 Customer Users ──────────────────────────────────────────────────────
  const customerData = [
    ["customer@hackathon.com",  "Jury",    "Customer", "9876543210"],
    ["alice@hackathon.com",     "Alice",   "Desai",    "9123456780"],
    ["bob@hackathon.com",       "Bob",     "Mehta",    "9234567891"],
    ["charlie@hackathon.com",   "Charlie", "Verma",    "9345678902"],
    ["diana@hackathon.com",     "Diana",   "Patel",    "9456789013"],
    ["eve@hackathon.com",       "Eve",     "Singh",    "9567890124"],
    ["frank@hackathon.com",     "Frank",   "Reddy",    "9678901235"],
    ["grace@hackathon.com",     "Grace",   "Nair",     "9789012346"],
    ["henry@hackathon.com",     "Henry",   "Iyer",     "9890123457"],
    ["irene@hackathon.com",     "Irene",   "Krishnan", "9901234568"],
    ["jay@hackathon.com",       "Jay",     "Bose",     "9012345679"],
    ["kavya@hackathon.com",     "Kavya",   "Gupta",    "8123456790"],
    ["liam@hackathon.com",      "Liam",    "Shah",     "8234567801"],
    ["mia@hackathon.com",       "Mia",     "Rao",      "8345678912"],
    ["nikhil@hackathon.com",    "Nikhil",  "Jain",     "8456789023"],
  ];

  const customers = await Promise.all(
    customerData.map(([email, fn, ln, phone]) =>
      prisma.user.upsert({
        where: { email }, update: {},
        create: { firstName: fn, lastName: ln, email, phone, password: hp, roleId: rCustomer.id, isActive: true },
      })
    )
  );
  console.log(`✅ ${customers.length} customers ready`);

  // ─── Categories ─────────────────────────────────────────────────────────────
  const [catElec, catFurni, catSports, catEvent, catAppliance, catMediaProd, catServices] = await Promise.all([
    prisma.category.upsert({ where: { name: "Electronics" },   update: {}, create: { name: "Electronics",    description: "Cameras, drones, laptops" } }),
    prisma.category.upsert({ where: { name: "Furniture"   },   update: {}, create: { name: "Furniture",      description: "Desks, chairs, beds" } }),
    prisma.category.upsert({ where: { name: "Sports"      },   update: {}, create: { name: "Sports",         description: "Cycles, fitness gear" } }),
    prisma.category.upsert({ where: { name: "Events"      },   update: {}, create: { name: "Events",         description: "Tents, sound, lighting" } }),
    prisma.category.upsert({ where: { name: "Appliances"  },   update: {}, create: { name: "Appliances",     description: "ACs, washing machines" } }),
    prisma.category.upsert({ where: { name: "Media Production" }, update: {}, create: { name: "Media Production", description: "Lights, rigs, microphones" } }),
    prisma.category.upsert({ where: { name: "Services"    },   update: {}, create: { name: "Services",       description: "System service products" } }),
  ]);
  console.log("✅ Categories ready");

  // ─── Service Products ───────────────────────────────────────────────────────
  await Promise.all([
    prisma.product.upsert({ where: { barcode: "SECURITY_DEPOSIT_SERVICE" }, update: {}, create: { name: "Security Deposit", barcode: "SECURITY_DEPOSIT_SERVICE", rentalPricePerDay: 0, depositAmount: 0, stockQuantity: 999999, categoryId: catServices.id, isAvailable: true, isPublished: true } }),
    prisma.product.upsert({ where: { barcode: "LATE_FEES_SERVICE" }, update: {}, create: { name: "Late Fees", barcode: "LATE_FEES_SERVICE", rentalPricePerDay: 0, depositAmount: 0, stockQuantity: 999999, categoryId: catServices.id, isAvailable: true, isPublished: true, lateFeeEnabled: true, lateFeeRate: 150 } }),
  ]);

  // ─── Products (20 items) ────────────────────────────────────────────────────
  const productDefs = [
    // Electronics
    { bc: "CAM-SONY-A7III",    name: "Sony Alpha A7 III Camera",     cat: catElec,     v: vendor2, price: 1200, dep: 8000,  stock: 3,  desc: "Full-frame mirrorless, 24.2MP — weddings & events" },
    { bc: "DRN-DJI-MAVIC3",    name: "DJI Mavic 3 Drone",            cat: catElec,     v: vendor2, price: 2500, dep: 15000, stock: 2,  desc: "4K 60fps aerial drone with obstacle avoidance" },
    { bc: "LAP-MBP-M3-14",     name: "MacBook Pro 14-inch (M3)",     cat: catElec,     v: vendor2, price: 1800, dep: 90000, stock: 5,  desc: "Apple M3 — ideal for video editing & dev work" },
    { bc: "PRJ-EPSON-EB",      name: "Epson EB-L400U Projector",     cat: catElec,     v: vendor2, price: 900,  dep: 25000, stock: 4,  desc: "4,500 lumen laser projector, WUXGA resolution" },
    { bc: "CAM-GH6-LUMIX",     name: "Panasonic Lumix GH6",          cat: catElec,     v: vendor2, price: 900,  dep: 7000,  stock: 4,  desc: "Micro 4/3 camera, 5.7K video, unlimited recording" },
    // Media Production
    { bc: "MIC-RODE-NTG5",     name: "Rode NTG5 Shotgun Mic",        cat: catMediaProd, v: vendor2, price: 300, dep: 2000,  stock: 6,  desc: "Professional broadcast shotgun microphone" },
    { bc: "LGT-APUTURE-600",   name: "Aputure 600D Pro LED Panel",   cat: catMediaProd, v: vendor2, price: 600, dep: 5000,  stock: 3,  desc: "600W professional LED light with Bowens mount" },
    { bc: "SPK-BOSE-PA",       name: "Bose PA Speaker System",       cat: catElec,     v: vendor3, price: 800, dep: 4000,  stock: 4,  desc: "Professional 500W PA system with wireless mic" },
    // Furniture
    { bc: "CHR-ERGO-HERMAN",   name: "Herman Miller Aeron Chair",    cat: catFurni,    v: vendor1, price: 250, dep: 3000,  stock: 8,  desc: "Premium ergonomic office chair, adjustable" },
    { bc: "DSK-ADJ-120",       name: "Height-Adjustable Desk 120cm", cat: catFurni,    v: vendor1, price: 350, dep: 5000,  stock: 6,  desc: "Electric standing desk with memory settings" },
    { bc: "TBL-CONF-8S",       name: "8-Seater Conference Table",    cat: catFurni,    v: vendor1, price: 700, dep: 12000, stock: 2,  desc: "Glass-top boardroom table with cable management" },
    { bc: "SOF-L-SHAPE-3S",    name: "L-Shaped Office Sofa",         cat: catFurni,    v: vendor1, price: 450, dep: 8000,  stock: 3,  desc: "Premium fabric L-sofa — office reception / lounge" },
    // Sports
    { bc: "CYC-TREK-FX3",      name: "Trek FX3 Hybrid Bicycle",      cat: catSports,   v: vendor1, price: 250, dep: 12000, stock: 8,  desc: "Lightweight hybrid bike, 21-speed Shimano" },
    { bc: "TRD-COMMERCIAL",    name: "Commercial Treadmill",          cat: catSports,   v: vendor3, price: 600, dep: 10000, stock: 3,  desc: "Commercial-grade treadmill, 22 km/h max" },
    { bc: "SKT-ROLLERBLADE",   name: "Rollerblade Zetrablade Set",    cat: catSports,   v: vendor1, price: 150, dep: 2000,  stock: 10, desc: "Adult inline skates, size-adjustable, set of 2" },
    // Events
    { bc: "TNT-20X30-CANOPY",  name: "20×30 ft Canopy Tent",         cat: catEvent,    v: vendor3, price: 2000, dep: 20000, stock: 2, desc: "Heavy-duty waterproof canopy for 150+ guests" },
    { bc: "LED-DANCE-10X10",   name: "LED Dance Floor 10×10 ft",     cat: catEvent,    v: vendor3, price: 3000, dep: 25000, stock: 1, desc: "RGB LED dance floor with wireless controller" },
    { bc: "SND-SYSTEM-DJ",     name: "DJ Sound System Complete",      cat: catEvent,    v: vendor3, price: 2500, dep: 15000, stock: 2, desc: "2× Pioneer CDJ3000 + DJM-900NXS2 + JBL SRX" },
    // Appliances
    { bc: "AC-LG-15TON",       name: "LG 1.5 Ton Split AC",          cat: catAppliance, v: vendor1, price: 400, dep: 8000,  stock: 5, desc: "5-star rated, Wi-Fi enabled, fast cooling" },
    { bc: "WM-BOSCH-7KG",      name: "Bosch Front-Load Washer 7kg",  cat: catAppliance, v: vendor1, price: 250, dep: 5000,  stock: 4, desc: "A+++ rated, 1400 RPM, 15 wash programmes" },
  ];

  const products = [];
  for (const p of productDefs) {
    const prod = await prisma.product.upsert({
      where: { barcode: p.bc }, update: {},
      create: {
        name: p.name, description: p.desc, barcode: p.bc,
        categoryId: p.cat.id, vendorId: p.v.id,
        rentalPricePerDay: p.price, depositAmount: p.dep,
        stockQuantity: p.stock, isAvailable: true, isPublished: true,
        isFeatured: rnd(0, 3) === 0, lateFeeEnabled: true, lateFeeRate: 150,
        images: { create: [{ url: `https://picsum.photos/seed/${p.bc}/400/300`, isPrimary: true }] },
      },
    });
    products.push({ ...prod, _def: p });
  }
  console.log(`✅ ${products.length} products ready`);

  // ─── Pricelists ─────────────────────────────────────────────────────────────
  await prisma.pricelist.create({
    data: {
      name: "Standard Rates 2025", description: "Default daily/weekly pricing", isActive: true,
      rules: {
        create: [
          { productId: products[0].id, minQty: 1, periodicity: "DAILY",  priceType: "FIXED", fixedPrice: 1200 },
          { productId: products[1].id, minQty: 1, periodicity: "DAILY",  priceType: "FIXED", fixedPrice: 2500 },
          { categoryId: catFurni.id,   minQty: 3, periodicity: "WEEKLY", priceType: "RANGE", minPrice: 900, maxPrice: 1500 },
          { categoryId: catEvent.id,   minQty: 1, periodicity: "DAILY",  priceType: "RANGE", minPrice: 2000, maxPrice: 4000 },
        ],
      },
    },
  });
  await prisma.pricelist.create({
    data: {
      name: "Weekend Special", description: "Discounted Fri–Sun rates", isActive: true,
      rules: {
        create: [
          { categoryId: catElec.id,  minQty: 1, periodicity: "DAILY", priceType: "RANGE", minPrice: 800, maxPrice: 1000 },
          { categoryId: catEvent.id, minQty: 1, periodicity: "DAILY", priceType: "RANGE", minPrice: 1500, maxPrice: 2500 },
        ],
      },
    },
  });
  console.log("✅ Pricelists ready");

  // ─── Coupons ────────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.coupon.upsert({ where: { code: "HACKATHON20" }, update: {}, create: { code: "HACKATHON20", discountPct: 20,  isActive: true, expiresAt: daysFrom(30), maxUsage: 500, usageCount: 87 } }),
    prisma.coupon.upsert({ where: { code: "FLAT500"     }, update: {}, create: { code: "FLAT500",     discountFlat: 500, isActive: true, expiresAt: daysFrom(15), maxUsage: 200, usageCount: 43 } }),
    prisma.coupon.upsert({ where: { code: "NEWUSER10"   }, update: {}, create: { code: "NEWUSER10",   discountPct: 10,  isActive: true, maxUsage: 1000, usageCount: 312 } }),
    prisma.coupon.upsert({ where: { code: "SUMMER30"    }, update: {}, create: { code: "SUMMER30",    discountPct: 30,  isActive: false, expiresAt: daysAgo(10), maxUsage: 300, usageCount: 298 } }),
    prisma.coupon.upsert({ where: { code: "BULK2025"    }, update: {}, create: { code: "BULK2025",    discountPct: 15,  isActive: true, minQty: undefined, expiresAt: daysFrom(60), maxUsage: 50, usageCount: 9 } }),
  ]);
  console.log("✅ Coupons ready");

  // ─── Helper: create a full rental order ────────────────────────────────────
  async function makeOrder({ customer, product, pickupDate, returnDate, status, paid = true, isLate = false, daysLate = 0 }) {
    const days = Math.max(1, Math.round((returnDate - pickupDate) / 86_400_000));
    const cost  = product.rentalPricePerDay * days;

    const order = await prisma.rentalOrder.create({
      data: {
        userId: customer.id, status,
        pickupDate, returnDate,
        totalCost: cost, finalCost: cost, discountAmount: 0,
        items: { create: [{ productId: product.id, quantity: 1, pricePerDay: product.rentalPricePerDay }] },
      },
    });

    if (product.depositAmount > 0) {
      await prisma.securityDeposit.create({
        data: {
          rentalOrderId: order.id,
          amount: product.depositAmount,
          isRefunded: status === "COMPLETED",
          refundAmount: status === "COMPLETED" ? product.depositAmount : null,
        },
      });
    }

    if (paid) {
      await prisma.payment.create({
        data: { rentalOrderId: order.id, amount: cost, status: "COMPLETED" },
      });
    }


    if (status === "COMPLETED" || status === "OVERDUE") {
      const returnedAt = isLate ? new Date(returnDate.getTime() + daysLate * 86_400_000) : returnDate;
      const inspection = await prisma.returnInspection.create({
        data: {
          rentalOrderId: order.id,
          returnedAt,
          isDamaged: rnd(0, 5) === 0,
          damageReport: rnd(0, 5) === 0 ? "Minor cosmetic scratches on surface" : null,
        },
      });
      if (isLate && daysLate > 0) {
        await prisma.lateFee.create({
          data: {
            returnInspectionId: inspection.id,
            daysLate,
            penaltyAmount: 150 * 24 * daysLate,
            isPaid: status === "COMPLETED",
          },
        });
      }
    }

    return order;
  }

  // ─── 6 months of historical orders (for revenue charts) ───────────────────
  console.log("🛒 Creating 6 months of rental history...");
  const historyScenarios = [
    // Month 6 ago
    [0, 0,  monthsAgo(6, 3),  monthsAgo(6, 8),  "COMPLETED", true,  false, 0],
    [1, 4,  monthsAgo(6, 10), monthsAgo(6, 15), "COMPLETED", true,  false, 0],
    [2, 8,  monthsAgo(6, 18), monthsAgo(6, 22), "COMPLETED", true,  false, 0],
    [3, 7,  monthsAgo(6, 5),  monthsAgo(6, 9),  "COMPLETED", true,  false, 0],
    // Month 5 ago
    [4, 2,  monthsAgo(5, 2),  monthsAgo(5, 7),  "COMPLETED", true,  false, 0],
    [5, 9,  monthsAgo(5, 12), monthsAgo(5, 18), "COMPLETED", true,  false, 0],
    [6, 15, monthsAgo(5, 20), monthsAgo(5, 25), "COMPLETED", true,  true,  2],
    [7, 1,  monthsAgo(5, 8),  monthsAgo(5, 10), "COMPLETED", true,  false, 0],
    // Month 4 ago
    [8, 3,  monthsAgo(4, 5),  monthsAgo(4, 9),  "COMPLETED", true,  false, 0],
    [9, 16, monthsAgo(4, 14), monthsAgo(4, 16), "COMPLETED", true,  false, 0],
    [10, 5, monthsAgo(4, 20), monthsAgo(4, 27), "COMPLETED", true,  true,  3],
    [11, 6, monthsAgo(4, 3),  monthsAgo(4, 6),  "COMPLETED", true,  false, 0],
    [12, 10, monthsAgo(4,11), monthsAgo(4, 14), "COMPLETED", true,  false, 0],
    // Month 3 ago
    [0, 12, monthsAgo(3, 1),  monthsAgo(3, 5),  "COMPLETED", true,  false, 0],
    [1, 17, monthsAgo(3, 10), monthsAgo(3, 13), "COMPLETED", true,  false, 0],
    [2, 4,  monthsAgo(3, 15), monthsAgo(3, 20), "COMPLETED", true,  true,  1],
    [3, 18, monthsAgo(3, 22), monthsAgo(3, 27), "COMPLETED", true,  false, 0],
    [4, 11, monthsAgo(3, 7),  monthsAgo(3, 10), "COMPLETED", true,  false, 0],
    [5, 0,  monthsAgo(3, 3),  monthsAgo(3, 7),  "COMPLETED", true,  false, 0],
    // Month 2 ago
    [6, 14, monthsAgo(2, 5),  monthsAgo(2, 8),  "COMPLETED", true,  false, 0],
    [7, 3,  monthsAgo(2, 12), monthsAgo(2, 15), "COMPLETED", true,  false, 0],
    [8, 19, monthsAgo(2, 18), monthsAgo(2, 22), "COMPLETED", true,  false, 0],
    [9, 13, monthsAgo(2, 2),  monthsAgo(2, 6),  "COMPLETED", true,  true,  2],
    [10, 7, monthsAgo(2, 20), monthsAgo(2, 25), "COMPLETED", true,  false, 0],
    [11, 1, monthsAgo(2, 8),  monthsAgo(2, 12), "COMPLETED", true,  false, 0],
    // Month 1 ago
    [12, 2, monthsAgo(1, 5),  monthsAgo(1, 10), "COMPLETED", true,  false, 0],
    [13, 16, monthsAgo(1,12), monthsAgo(1, 14), "COMPLETED", true,  false, 0],
    [14, 0, monthsAgo(1, 15), monthsAgo(1, 20), "COMPLETED", true,  true,  1],
    [0, 5,  monthsAgo(1, 22), monthsAgo(1, 26), "COMPLETED", true,  false, 0],
    [1, 9,  monthsAgo(1, 3),  monthsAgo(1, 7),  "COMPLETED", true,  false, 0],
    [2, 18, monthsAgo(1, 18), monthsAgo(1, 22), "COMPLETED", true,  false, 0],
  ];

  for (const [ci, pi, pickupDate, returnDate, status, paid, isLate, daysLate] of historyScenarios) {
    await makeOrder({ customer: customers[ci % customers.length], product: products[pi % products.length], pickupDate, returnDate, status, paid, isLate, daysLate });
  }
  console.log(`✅ ${historyScenarios.length} historical orders created`);

  // ─── Current orders (dashboard activity) ──────────────────────────────────
  const currentOrders = [
    // status ACTIVE
    [0,  0,  daysAgo(5),   daysFrom(3),  "ACTIVE",    true,  false, 0],
    [1,  4,  daysAgo(3),   daysFrom(5),  "ACTIVE",    true,  false, 0],
    [2,  12, daysAgo(1),   daysFrom(7),  "ACTIVE",    true,  false, 0],
    [3,  2,  daysAgo(7),   daysFrom(2),  "ACTIVE",    true,  false, 0],
    // OVERDUE
    [4,  1,  daysAgo(12),  daysAgo(2),   "OVERDUE",   true,  true,  3],
    [5,  3,  daysAgo(8),   daysAgo(1),   "OVERDUE",   true,  true,  1],
    // PENDING
    [6,  5,  daysFrom(1),  daysFrom(6),  "PENDING",   false, false, 0],
    [7,  6,  daysFrom(2),  daysFrom(9),  "PENDING",   false, false, 0],
    [8,  14, daysFrom(1),  daysFrom(4),  "PENDING",   false, false, 0],
    // Recent COMPLETED
    [9,  7,  daysAgo(10),  daysAgo(5),   "COMPLETED", true,  false, 0],
    [10, 8,  daysAgo(14),  daysAgo(7),   "COMPLETED", true,  false, 0],
    [11, 19, daysAgo(20),  daysAgo(12),  "COMPLETED", true,  true,  2],
    // CANCELLED
    [12, 10, daysAgo(3),   daysFrom(5),  "CANCELLED", false, false, 0],
    // Due today / tomorrow for dashboard
    [13, 15, daysAgo(3),   daysFrom(0),  "ACTIVE",    true,  false, 0],
    [14, 16, daysAgo(5),   daysFrom(1),  "ACTIVE",    true,  false, 0],
  ];

  for (const [ci, pi, pickupDate, returnDate, status, paid, isLate, daysLate] of currentOrders) {
    await makeOrder({ customer: customers[ci % customers.length], product: products[pi % products.length], pickupDate, returnDate, status, paid, isLate, daysLate });
  }
  console.log(`✅ ${currentOrders.length} current orders created`);

  // ─── Reviews ────────────────────────────────────────────────────────────────
  const reviewData = [
    [0, 0,  5, "Absolutely brilliant camera — made our wedding photos stunning!"],
    [1, 4,  5, "Herman Miller chair is superb. Highly recommend for long WFH days."],
    [2, 12, 4, "Great bicycle, smooth gears. Delivery was punctual."],
    [3, 2,  3, "MacBook was okay, battery life could have been better."],
    [4, 5,  5, "Standing desk transformed my work setup — worth every rupee!"],
    [5, 7,  4, "Bose speaker delivered crystal-clear sound at our corporate event."],
    [6, 1,  5, "DJI Mavic footage was cinematic. Staff was very helpful."],
    [7, 9,  4, "Treadmill worked perfectly. Would rent again for our office event."],
    [8, 15, 5, "Canopy tent was huge and waterproof. Saved our outdoor wedding!"],
    [9, 16, 5, "LED dance floor was the highlight of the evening. Absolute show-stopper!"],
    [10, 3, 4, "Projector image was bright and sharp. Easy to set up."],
    [11, 19, 5, "Bosch washer ran quietly and cleaned perfectly. Great service!"],
  ];

  for (const [ci, pi, rating, comment] of reviewData) {
    await prisma.review.create({
      data: { userId: customers[ci].id, productId: products[pi].id, rating, comment },
    }).catch(() => {}); // skip duplicate
  }
  console.log(`✅ ${reviewData.length} reviews ready`);

  // ─── Notifications ──────────────────────────────────────────────────────────
  const notifTypes = [
    { type: "EMAIL_REMINDER", message: "Your Sony Camera rental is due in 24 hours. Please arrange return." },
    { type: "PICKUP",         message: "Order confirmed! Your MacBook Pro is ready for pickup at Whitefield branch." },
    { type: "RETURN",         message: "Thank you! Deposit of ₹12,000 will be refunded within 3-5 business days." },
    { type: "LATE_RETURN",    message: "⚠️ OVERDUE: DJI Mavic is 3 days past return date. Late charges: ₹10,800." },
    { type: "EMAIL_REMINDER", message: "Your Trek bicycle rental ends tomorrow. Kindly return by 6 PM." },
    { type: "PICKUP",         message: "LED Dance Floor is confirmed for your event on Saturday." },
    { type: "RETURN",         message: "Herman Miller chair returned successfully. Thank you for choosing RentFlow!" },
  ];

  for (let i = 0; i < customers.length; i++) {
    await prisma.notification.create({
      data: { userId: customers[i].id, ...notifTypes[i % notifTypes.length], isRead: rnd(0, 1) === 1 },
    });
  }
  // Admin notifications
  await prisma.notification.create({ data: { userId: adminUser.id, type: "LATE_RETURN", message: "3 rentals are currently overdue. Review required.", isRead: false } });
  await prisma.notification.create({ data: { userId: adminUser.id, type: "EMAIL_REMINDER", message: "Weekly summary: ₹1,85,000 revenue collected this week.", isRead: false } });
  console.log("✅ Notifications ready");

  // ─── Audit Logs ─────────────────────────────────────────────────────────────
  const auditEntries = [
    { action: "USER_LOGIN",         entity: "User",         details: "Admin logged in from 192.168.1.1" },
    { action: "PRODUCT_CREATED",    entity: "Product",      details: "New product 'Sony Alpha A7 III' added by Vendor" },
    { action: "ORDER_STATUS_CHANGED", entity: "RentalOrder", details: "Order status changed: PENDING → ACTIVE" },
    { action: "PAYMENT_RECEIVED",   entity: "Payment",      details: "Payment of ₹14,400 received for Order #ORD-001" },
    { action: "RETURN_PROCESSED",   entity: "ReturnInspection", details: "Return inspection completed. No damage reported." },
    { action: "LATE_FEE_APPLIED",   entity: "LateFee",      details: "Late fee of ₹10,800 applied for 3-day overdue" },
    { action: "DEPOSIT_REFUNDED",   entity: "SecurityDeposit", details: "Deposit of ₹8,000 refunded to customer" },
    { action: "COUPON_CREATED",     entity: "Coupon",       details: "Coupon SUMMER30 created with 30% discount" },
    { action: "SETTINGS_UPDATED",   entity: "GlobalSettings", details: "Grace period changed from 15 to 30 minutes" },
    { action: "USER_REGISTERED",    entity: "User",         details: "New customer Alice Desai registered" },
    { action: "PRODUCT_PUBLISHED",  entity: "Product",      details: "MacBook Pro 14-inch published to catalog" },
    { action: "ORDER_CANCELLED",    entity: "RentalOrder",  details: "Order cancelled by customer. Refund initiated." },
  ];

  for (const entry of auditEntries) {
    await prisma.auditLog.create({
      data: { userId: adminUser.id, entityId: "mock-entity-id", ...entry },
    });
  }
  console.log("✅ Audit logs ready");

  // ─── Quotation Templates ────────────────────────────────────────────────────
  await Promise.all([
    prisma.quotationTemplate.upsert({
      where: { id: "qt-default-001" }, update: {},
      create: { id: "qt-default-001", name: "Standard Quotation Template", isDefault: true, headerText: "RentFlow Rental Services | GST: 27AAAAA1234A1Z5 | support@rentflow.in", footerText: "Terms: 50% advance required. Security deposit refunded within 7 business days. Overdue: ₹150/hr.", noteText: "Prices include 18% GST. Quote valid 3 days. Subject to availability." },
    }),
    prisma.quotationTemplate.create({
      data: { name: "Event Quotation Template", isDefault: false, headerText: "RentFlow Events Division | events@rentflow.in | +91 98765 43210", footerText: "Cancellation Policy: 72hr notice required. No-show: 100% charge.", noteText: "Event package includes setup and teardown support. Damage waiver available." },
    }).catch(() => {}),
    prisma.quotationTemplate.create({
      data: { name: "Corporate Bulk Template", isDefault: false, headerText: "RentFlow Corporate | For bulk orders and long-term rentals contact corporate@rentflow.in", footerText: "Exclusive corporate pricing. GST invoice provided. Net-30 payment terms available.", noteText: "Minimum 5-unit order for bulk rates. Dedicated account manager assigned." },
    }).catch(() => {}),
  ]);
  console.log("✅ Quotation templates ready");

  // ─── Global Settings ────────────────────────────────────────────────────────
  const existing = await prisma.globalSettings.findFirst();
  if (!existing) {
    await prisma.globalSettings.create({ data: { lateFeeEnabled: true, defaultLateFeeRate: 150, gracePeriodMinutes: 30, maxLateFeeAmount: 5000 } });
  } else {
    await prisma.globalSettings.update({ where: { id: existing.id }, data: { lateFeeEnabled: true, defaultLateFeeRate: 150, gracePeriodMinutes: 30, maxLateFeeAmount: 5000 } });
  }
  console.log("✅ Global settings ready");

  // ─── Summary ────────────────────────────────────────────────────────────────
  const [orderCount, productCount, customerCount, paymentAgg] = await Promise.all([
    prisma.rentalOrder.count(),
    prisma.product.count({ where: { barcode: { notIn: ["SECURITY_DEPOSIT_SERVICE", "LATE_FEES_SERVICE"] } } }),
    prisma.user.count({ where: { role: { name: "CUSTOMER" } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
  ]);

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉  Full Admin Showcase Data Ready!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  📦 Products       : ${productCount}`);
  console.log(`  👤 Customers      : ${customerCount}`);
  console.log(`  📋 Rental Orders  : ${orderCount}`);
  console.log(`  💰 Total Revenue  : ₹${paymentAgg._sum.amount?.toLocaleString() || 0}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin    : admin@hackathon.com    / Password123!");
  console.log("  Vendor   : vendor@hackathon.com   / Password123!");
  console.log("  Customer : customer@hackathon.com / Password123!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
