import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Store in global to prevent multiple instances in serverless environments
// This works for both development and production (including Vercel)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}