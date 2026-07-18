import { prisma } from "../config/db.js";

export const generateRevenueReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const payments = await prisma.payment.findMany({
    where: { status: "COMPLETED" },
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

  if (isVendor) {
    // Only return payments for orders containing the vendor's products
    return payments.filter(p => 
      p.rentalOrder.items.some(item => item.product.vendorId === user.id)
    );
  }

  return payments;
};

export const generateRentalReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const rentals = await prisma.rentalOrder.findMany({
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (isVendor) {
    // Return only orders where at least one product belongs to the vendor
    return rentals.filter(r => 
      r.items.some(item => item.product.vendorId === user.id)
    ).map(r => ({
      ...r,
      // Filter the items list to only show the vendor's own items
      items: r.items.filter(item => item.product.vendorId === user.id)
    }));
  }

  return rentals;
};

export const generateCustomerReport = async (user) => {
  const isVendor = user.role.name === "VENDOR";

  const customers = await prisma.user.findMany({
    where: { role: { name: "CUSTOMER" } },
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

  if (isVendor) {
    // Filter customers who have rented items from this vendor
    return customers.filter(c => 
      c.rentalOrders.some(order => 
        order.items.some(item => item.product.vendorId === user.id)
      )
    );
  }

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
