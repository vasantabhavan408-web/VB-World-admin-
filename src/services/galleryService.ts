import prisma from '../utils/prisma.js';
import fs from 'fs/promises';
import path from 'path';

export async function getAllGalleryImages() {
  return prisma.branchGalleryImage.findMany({
    orderBy: {
      displayOrder: 'asc',
    },
  });
}

export async function createGalleryImage(data: { imageUrl: string; row: number; displayOrder: number }) {
  return prisma.branchGalleryImage.create({
    data,
  });
}

export async function updateGalleryImage(id: number, data: { imageUrl?: string; row?: number; displayOrder?: number }) {
  return prisma.branchGalleryImage.update({
    where: { id },
    data,
  });
}

export async function deleteGalleryImage(id: number) {
  const record = await prisma.branchGalleryImage.findUnique({
    where: { id },
  });

  if (record) {
    if (record.imageUrl && record.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', record.imageUrl);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete file from disk: ${filePath}`, err);
      }
    }
  }

  return prisma.branchGalleryImage.delete({
    where: { id },
  });
}

export async function reorderGalleryImages(items: Array<{ id: number; displayOrder: number }>) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.branchGalleryImage.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder },
      })
    )
  );
}
