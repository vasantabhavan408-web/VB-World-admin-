import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('Connecting to Aiven PostgreSQL...');
  console.log('Target:', process.env.DATABASE_URL.split('@')[1]);

  const sqlPath = path.join(process.cwd(), 'prisma', 'dump.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split SQL commands cleanly by semicolon ignoring empty lines and comments
  const lines = sql.split('\n');
  let currentCmd = '';
  const commands = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') || trimmed.length === 0) continue;
    currentCmd += line + '\n';
    if (trimmed.endsWith(';')) {
      commands.push(currentCmd.trim());
      currentCmd = '';
    }
  }

  console.log(`Executing ${commands.length} SQL commands on Aiven...`);
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (!cmd) continue;
    try {
      await prisma.$executeRawUnsafe(cmd);
    } catch (err) {
      console.warn(`Warning on command ${i + 1}: ${err.message}`);
    }
  }

  console.log('--- VERIFYING AIVEN DATA ---');
  const userCount = await prisma.user.count();
  const countryCount = await prisma.country.count();
  const locationCount = await prisma.location.count();
  const menuCatCount = await prisma.menuCategory.count();
  const galleryCount = await prisma.branchGalleryImage.count();

  console.log(`Users: ${userCount}`);
  console.log(`Countries: ${countryCount}`);
  console.log(`Locations (Branches): ${locationCount}`);
  console.log(`Menu Categories: ${menuCatCount}`);
  console.log(`Gallery Images: ${galleryCount}`);

  console.log('🎉 Migration to Aiven completed successfully!');
}

main()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
