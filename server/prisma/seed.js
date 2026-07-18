import { prisma } from '../src/config/db.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Roles
  console.log('Creating roles...');
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrator with full access' },
  });

  const roleManager = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: { name: 'MANAGER', description: 'Manager for handling inventory' },
  });

  const roleCustomer = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Standard customer role' },
  });

  // 2. Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hackathon.com' },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@hackathon.com',
      password: hashedPassword,
      roleId: roleAdmin.id,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'jury@hackathon.com' },
    update: {},
    create: {
      firstName: 'Jury',
      lastName: 'Member',
      email: 'jury@hackathon.com',
      password: hashedPassword,
      roleId: roleCustomer.id,
    },
  });

  // 3. Create Categories
  console.log('Creating categories...');
  const catElectronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics', description: 'High-end electronic devices' },
  });

  const catVehicles = await prisma.category.upsert({
    where: { name: 'Vehicles' },
    update: {},
    create: { name: 'Vehicles', description: 'Rentable transportation' },
  });

  const catParty = await prisma.category.upsert({
    where: { name: 'Party Supplies' },
    update: {},
    create: { name: 'Party Supplies', description: 'Everything for a good party' },
  });

  // 4. Create Products
  console.log('Creating products...');
  const productLaptop = await prisma.product.upsert({
    where: { barcode: 'ELEC-MBP-001' },
    update: {},
    create: {
      categoryId: catElectronics.id,
      name: 'MacBook Pro M3 Max',
      description: 'The ultimate laptop for creators.',
      barcode: 'ELEC-MBP-001',
      rentalPricePerDay: 45.0,
      depositAmount: 500.0,
      stockQuantity: 5,
    },
  });

  const productScooter = await prisma.product.upsert({
    where: { barcode: 'VEH-SCOOT-002' },
    update: {},
    create: {
      categoryId: catVehicles.id,
      name: 'Segway Ninebot Max',
      description: 'Long-range electric scooter.',
      barcode: 'VEH-SCOOT-002',
      rentalPricePerDay: 20.0,
      depositAmount: 150.0,
      stockQuantity: 10,
    },
  });

  const productSpeaker = await prisma.product.upsert({
    where: { barcode: 'PARTY-JBL-003' },
    update: {},
    create: {
      categoryId: catParty.id,
      name: 'JBL PartyBox 310',
      description: 'Huge sound, dazzling lights and unbelievable power set this speaker apart from the crowd.',
      barcode: 'PARTY-JBL-003',
      rentalPricePerDay: 30.0,
      depositAmount: 200.0,
      stockQuantity: 3,
    },
  });

  // 5. Create Rental Order (Example)
  console.log('Creating example rental order...');
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const rental = await prisma.rentalOrder.create({
    data: {
      userId: customerUser.id,
      status: 'ACTIVE',
      pickupDate: today,
      returnDate: nextWeek,
      totalCost: 140.0, // 7 days * 20.0 for scooter
      items: {
        create: [
          {
            productId: productScooter.id,
            quantity: 1,
            pricePerDay: 20.0,
          }
        ]
      },
      payment: {
        create: {
          amount: 140.0,
          status: 'COMPLETED'
        }
      },
      deposit: {
        create: {
          amount: 150.0
        }
      }
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin Email: admin@hackathon.com');
  console.log('Customer Email: jury@hackathon.com');
  console.log('Password (for both): Password123!');
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
