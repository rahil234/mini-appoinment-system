import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDatabase() {
  await prisma
    .$connect()
    .then(() => console.log('Database connected!'))
    .catch((err) => {
      console.error(err);
    });
}
