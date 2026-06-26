import { z } from 'zod';

export const productVariantSchema = z.object({
  product_id: z.number().int().optional(),
  volume: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  purchase_date: z.string().datetime().nullable().optional(),
  opened_date: z.string().datetime().nullable().optional(),
  finished_date: z.string().datetime().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  features: z.record(z.string(), z.any()).nullable().optional(),
  status: z.enum(['new', 'in_use', 'finished', 'expired']),
});