import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  const dumpPath = path.join(process.cwd(), 'prisma', 'dump.sql');
  const sql = fs.readFileSync(dumpPath, 'utf8');

  console.log('Executing database schema & dump...');
  // Execute transaction script
  await prisma.$executeRawUnsafe(sql);
  console.log('✅ Database schema and seed data imported successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error executing dump:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
