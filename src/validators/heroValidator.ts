import { z } from 'zod';

export const updateHeroSchema = z.object({
  page: z.string().optional(),
  titleHtml: z.string().min(1, 'Title HTML is required'),
  subtitleHtml: z.string().min(1, 'Subtitle HTML is required'),
  webBannerUrl: z.string().optional(),
  mobileBannerUrl: z.string().optional(),
});

export type UpdateHeroInput = z.infer<typeof updateHeroSchema>;
