import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const ctas = await prisma.privacyPolicyCTA.findMany();
  console.log("All CTA records:", ctas);
  const heroConfigs = await prisma.heroConfig.findMany();
  console.log("All Hero configs:", heroConfigs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
