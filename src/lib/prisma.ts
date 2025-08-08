import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Use existing instance if available, otherwise create a new one
const prisma = global.prisma || new PrismaClient({
  log: [],
});

// Set global prisma instance in development for hot reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; 