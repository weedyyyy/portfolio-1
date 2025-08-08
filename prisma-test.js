const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log('Prisma connect OK');
  await prisma.$disconnect();
})();
