import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});
