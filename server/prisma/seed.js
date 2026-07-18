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
  console.log('Seeding mock catalog products...');
  
  // Sofa
  await prisma.product.upsert({
    where: { barcode: 'prod-sofa' },
    update: {},
    create: {
      name: 'Sofa',
      description: 'Classic premium comfortable 3-seater sofa fabric.',
      barcode: 'prod-sofa',
      rentalPricePerDay: 150,
      depositAmount: 5000,
      stockQuantity: 5,
      categoryId: catFurniture.id,
      vendorId: vendorUser.id,
      isAvailable: true,
      isPublished: true,
      variants: {
        create: [
          { name: 'Color', value: 'Classic Blue', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop' },
          { name: 'Color', value: 'Mustard Gold', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop' }
        ]
      }
    }
  });

  // MacBook
  await prisma.product.upsert({
    where: { barcode: 'prod-macbook' },
    update: {},
    create: {
      name: 'MacBook Pro 16"',
      description: 'Apple M3 Pro laptop for developers and creators.',
      barcode: 'prod-macbook',
      rentalPricePerDay: 1500,
      depositAmount: 15000,
      stockQuantity: 4,
      categoryId: catElectronics.id,
      vendorId: vendorUser.id,
      isAvailable: true,
      isPublished: true,
      variants: {
        create: [
          { name: 'Color', value: 'Space Gray', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop' },
          { name: 'Color', value: 'Silver', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop' }
        ]
      }
    }
  });

  // Camera
  await prisma.product.upsert({
    where: { barcode: 'prod-camera' },
    update: {},
    create: {
      name: 'Canon EOS R5 Camera',
      description: 'Full-frame mirrorless digital photography.',
      barcode: 'prod-camera',
      rentalPricePerDay: 2500,
      depositAmount: 25000,
      stockQuantity: 3,
      categoryId: catElectronics.id,
      vendorId: vendorUser.id,
      isAvailable: true,
      isPublished: true,
    }
  });

  // Trek Bike
  await prisma.product.upsert({
    where: { barcode: 'prod-trek' },
    update: {},
    create: {
      name: 'Mountain Bike - Trek',
      description: 'Durable gear trail suspension cycle.',
      barcode: 'prod-trek',
      rentalPricePerDay: 350,
      depositAmount: 4000,
      stockQuantity: 8,
      categoryId: catSports.id,
      vendorId: vendorUser.id,
      isAvailable: true,
      isPublished: true,
    }
  });

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
