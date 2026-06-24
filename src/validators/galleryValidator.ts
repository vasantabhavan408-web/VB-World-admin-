import { z } from 'zod';

export const createGalleryImageSchema = z.object({
  row: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(2)),
  displayOrder: z.preprocess((val) => parseInt(val as string, 10), z.number().int().default(0)),
});

export const updateGalleryImageSchema = z.object({
  row: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(2)).optional(),
  displayOrder: z.preprocess((val) => parseInt(val as string, 10), z.number().int()).optional(),
});

export const reorderGalleryImagesSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int(),
      displayOrder: z.number().int(),
    })
  ),
});

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type ReorderGalleryImagesInput = z.infer<typeof reorderGalleryImagesSchema>;
