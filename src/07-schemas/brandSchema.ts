import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Имя бренда должно быть длиннее 2 символов")
    .max(50, "Имя бренда слишком длинное"),
});