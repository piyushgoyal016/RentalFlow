import { prisma } from "../config/db.js";

export const generateRevenueReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const payments = await prisma.payment.findMany({
    where: {
      status: "COMPLETED",
      rentalOrder: isVendor ? {
        items: {
          some: {
            product: {
              vendorId: user.id
            }
          }
        }
      } : undefined
    },
    include: {
      rentalOrder: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });

  return payments;
};

export const generateRentalReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const rentals = await prisma.rentalOrder.findMany({
    where: isVendor ? {
      items: {
        some: {
          product: {
            vendorId: user.id
          }
        }
      }
    } : undefined,
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (isVendor) {
    // Keep mapping to filter only the vendor's items in the returned response
    return rentals.map(r => ({
      ...r,
      items: r.items.filter(item => item.product.vendorId === user.id)
    }));
  }

  return rentals;
};

export const generateCustomerReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const customers = await prisma.user.findMany({
    where: {
      role: { name: "CUSTOMER" },
      rentalOrders: isVendor ? {
        some: {
          items: {
            some: {
              product: {
                vendorId: user.id
              }
            }
          }
        }
      } : undefined
    },
    include: {
      rentalOrders: {
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  });

  return customers;
};

export const generateProductReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const whereClause = isVendor ? { vendorId: user.id } : {};

  return await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      rentalItems: true
    }
  });
};
