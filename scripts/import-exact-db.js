import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Reading exact SQL dump...');
  const sqlPath = path.join(process.cwd(), 'prisma', 'exact_vbworld_api_dump.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Connecting to database:', process.env.DATABASE_URL?.split('@')[1] || 'default');
  await prisma.$executeRawUnsafe(sql);
  console.log('Database successfully synchronized with exact vb-world-api data!');
}

main()
  .catch((e) => {
    console.error('Import error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
