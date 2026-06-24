import { z } from 'zod';

export const updateCtaSchema = z.object({
  page: z.string().optional(),
  titleHtml: z.string().min(1, 'Title HTML is required'),
  subtitleHtml: z.string().min(1, 'Subtitle HTML is required'),
  contactUsUrl: z.string().min(1, 'Contact Us URL is required'),
  exploreMenuUrl: z.string().min(1, 'Explore Menu URL is required'),
  imageUrl: z.string().optional(),
});

export type UpdateCtaInput = z.infer<typeof updateCtaSchema>;
