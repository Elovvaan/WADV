import { PrismaClient } from '@prisma/client';

declare global {
  var __wadvPrisma: PrismaClient | undefined;
}

export const prisma = globalThis.__wadvPrisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__wadvPrisma = prisma;
}
