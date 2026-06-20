import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
// Импортируем карту нашей базы данных из сгенерированного файла
import { Database } from './types/supabase';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Ошибка: Не найдены ключи SUPABASE_URL или SUPABASE_KEY в файле .env");
  process.exit(1);
}

// Передаем <Database> в createClient, чтобы клиент "выучил" структуру наших таблиц!
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);