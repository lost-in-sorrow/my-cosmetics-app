import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  // Сюда можно будет добавлять любые другие переменные
};

// Проверка на старте
if (!env.supabaseUrl || !env.supabaseKey) {
  throw new Error("❌ Ошибка: Не найдены переменные окружения SUPABASE");
}