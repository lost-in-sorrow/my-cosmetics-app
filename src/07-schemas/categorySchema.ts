import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, "Имя категории должно быть длиннее 2 символов"),
  parent_id: z.number().nullable().optional(), // Разрешаем передать null или число
});