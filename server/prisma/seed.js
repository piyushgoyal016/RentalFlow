import { prisma } from '../src/config/db.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('----------------------------------------------------');
  console.log('🌱 Starting database seeding (unified ecosystem)...');
  console.log('----------------------------------------------------');

  // 1. Create Roles
  console.log('Seeding default roles...');
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'System Administrator' },
  });

  const roleVendor = await prisma.role.upsert({
    where: { name: 'VENDOR' },
    update: {},
    create: { name: 'VENDOR', description: 'Third-party Vendor' },
  });

  const roleCustomer = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'End Customer' },
  });

  const roleManager = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: { name: 'MANAGER', description: 'Staff Manager' },
  });

  // Hash password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 2. Create Users
  console.log('Seeding default users...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hackathon.com' },
    update: {},
    create: {
      firstName: 'RentFlow',
      lastName: 'Admin',
      email: 'admin@hackathon.com',
      password: hashedPassword,
      roleId: roleAdmin.id,
      isActive: true,
    },
  });

  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@hackathon.com' },
    update: {},
    create: {
      firstName: 'RentFlow',
      lastName: 'Vendor',
      email: 'vendor@hackathon.com',
      password: hashedPassword,
      roleId: roleVendor.id,
      isActive: true,
      companyName: 'Easy Rent Furniture',
      companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200',
      gstNo: '27BBBBB2222B2Z2',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@hackathon.com' },
    update: {},
    create: {
      firstName: 'Jury',
      lastName: 'Customer',
      email: 'customer@hackathon.com',
      password: hashedPassword,
      roleId: roleCustomer.id,
      isActive: true,
    },
  });

  // 3. Create Categories
  console.log('Seeding categories...');
  const catElectronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics', description: 'Laptops, cameras, smart devices' },
  });

  const catFurniture = await prisma.category.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: { name: 'Furniture', description: 'Sofas, desks, beds' },
  });

  const catSports = await prisma.category.upsert({
    where: { name: 'Sports' },
    update: {},
    create: { name: 'Sports', description: 'Fitness gear, cycles' },
  });

  const serviceCategory = await prisma.category.upsert({
    where: { name: 'Services' },
    update: {},
    create: {
      name: 'Services',
      description: 'System service products such as deposits and fees',
      isActive: true,
    },
  });

  // 4. Create Service Products
  console.log('Seeding default service products...');
  await prisma.product.upsert({
    where: { barcode: 'LATE_FEES_SERVICE' },
    update: {},
    create: {
      name: 'Late Fees',
      description: 'System charge for overdue rental products (₹150 per hour)',
      barcode: 'LATE_FEES_SERVICE',
      rentalPricePerDay: 0,
      depositAmount: 0,
      stockQuantity: 999999,
      categoryId: serviceCategory.id,
      isAvailable: true,
      isPublished: true,
      lateFeeEnabled: true,
      lateFeeRate: 150.0,
    },
  });

  await prisma.product.upsert({
    where: { barcode: 'SECURITY_DEPOSIT_SERVICE' },
    update: {},
    create: {
      name: 'Security Deposit',
      description: 'Refundable security deposit for rental orders',
      barcode: 'SECURITY_DEPOSIT_SERVICE',
      rentalPricePerDay: 0,
      depositAmount: 0,
      stockQuantity: 999999,
      categoryId: serviceCategory.id,
      isAvailable: true,
      isPublished: true,
    },
  });

  // 5. Create Catalog Products (linking to Vendor)
  console.log('Skipping mock catalog products to maintain a clean database...');

  // 6. Create Global Settings
  console.log('Seeding default system settings...');
  const settings = await prisma.globalSettings.findMany();
  if (settings.length === 0) {
    await prisma.globalSettings.create({
      data: {
        lateFeeEnabled: true,
        defaultLateFeeRate: 150.0,
      },
    });
  } else {
    await prisma.globalSettings.update({
      where: { id: settings[0].id },
      data: {
        lateFeeEnabled: true,
        defaultLateFeeRate: 150.0,
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin Email: admin@hackathon.com');
  console.log('Vendor Email: vendor@hackathon.com');
  console.log('Customer Email: customer@hackathon.com');
  console.log('Password (for all): Password123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
