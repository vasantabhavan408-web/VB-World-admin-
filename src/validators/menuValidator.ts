import { z } from 'zod';

export const updateMenuBlockSchema = z.object({
  subtitle: z.string().min(1, 'Subtitle is required'),
  titleHighlight: z.string().min(1, 'Title Highlight is required'),
  titleNormal: z.string().min(1, 'Title Normal is required'),
  description: z.string().min(1, 'Description is required'),
  badgeLabel: z.string().optional().nullable(),
  badgeTitle: z.string().optional().nullable(),
  badgeDescription: z.string().optional().nullable(),
  badgeLink: z.string().optional().nullable(),
  buttonLabel: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  align: z.enum(['left', 'right']).default('left').optional(),
});

export type UpdateMenuBlockInput = z.infer<typeof updateMenuBlockSchema>;

export const createMenuExperienceSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric or hyphens'),
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  displayOrder: z.number().int().default(0).optional(),
});

export const updateMenuExperienceSchema = z.object({
  time: z.string().min(1, 'Time is required').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  imageUrl: z.string().min(1, 'Image URL is required').optional(),
  displayOrder: z.number().int().optional(),
});

export type CreateMenuExperienceInput = z.infer<typeof createMenuExperienceSchema>;
export type UpdateMenuExperienceInput = z.infer<typeof updateMenuExperienceSchema>;

