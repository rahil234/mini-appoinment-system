import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD env variables. Skipping admin user creation.');
  }

  const existing = await prisma.user.findFirst({ where: { email } });

  if (existing) {
    console.log('Admin already exists', existing);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created', user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
