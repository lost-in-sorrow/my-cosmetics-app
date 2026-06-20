import { supabase } from '../supabaseClient';

// Модуль для работы с таблицей брендов
export const brandService = {
  // Получить все бренды
  async getAll() {
    const { data, error } = await supabase.from('brands').select('*');
    if (error) throw new Error(`Ошибка чтения брендов: ${error.message}`);
    return data;
  },

  // Создать новый бренд
  async create(name: string) {
    const { data, error } = await supabase.from('brands').insert([{ name }]).select();
    if (error) throw new Error(`Ошибка создания бренда: ${error.message}`);
    return data;
  }
};