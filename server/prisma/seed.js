import { prisma } from '../src/config/db.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed (Roles & Users only)...');

  // 1. Create Roles
  console.log('Creating roles...');
  const roleAdmin = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Administrator with full access' },
  });

  const roleVendor = await prisma.role.upsert({
    where: { name: 'VENDOR' },
    update: {},
    create: { name: 'VENDOR', description: 'Vendor with restricted admin access' },
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
