import 'dotenv/config';
import { UserRole } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'; // or use another hashing library

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Hash the password (IMPORTANT: never store plain passwords!)
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@scoreboard.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });