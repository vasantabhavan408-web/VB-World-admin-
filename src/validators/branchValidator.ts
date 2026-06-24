import { z } from 'zod';

export const createCountrySchema = z.object({
  name: z.string().min(1, 'Country name is required'),
  overrideCount: z.coerce.number().optional().nullable(),
});

export const updateCountrySchema = z.object({
  name: z.string().min(1, 'Country name is required').optional(),
  overrideCount: z.coerce.number().optional().nullable(),
});

export const createLocationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  time: z.string().min(1, 'Operating time is required'),
  imageUrl: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  countryId: z.coerce.number().int().positive('Country ID is required'),
  comingSoon: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  directionLink: z.string().optional().nullable(),
  contactLink: z.string().optional().nullable(),
});

export const updateLocationSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  time: z.string().min(1, 'Operating time is required').optional(),
  imageUrl: z.string().optional(),
  state: z.string().min(1, 'State is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  countryId: z.coerce.number().int().positive('Country ID is required').optional(),
  comingSoon: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  directionLink: z.string().optional().nullable(),
  contactLink: z.string().optional().nullable(),
});

export type CreateCountryInput = z.infer<typeof createCountrySchema>;
export type UpdateCountryInput = z.infer<typeof updateCountrySchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
