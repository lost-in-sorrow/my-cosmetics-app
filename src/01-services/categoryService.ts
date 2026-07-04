import { supabase } from '../05-config/supabaseClient';
import { withTimeout } from '../05-config/withTimeout';
import { Tables } from '../04-types/supabase';

type Category = Tables<'categories'>;

export const categoryService = {
  // 1. Получение с пагинацией
  async getAll(page?: number, limit?: number): Promise<Category[]> {
    let query = supabase.from('categories').select('*').order('id', { ascending: true });

    if (page !== undefined && limit !== undefined) {
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await withTimeout(query, 'Loading categories');
    if (error) throw new Error(`Ошибка при получении категорий: ${error.message}`);
    return data || [];
  },

  // 2. Создание
  async create(name: string, parent_id: number | null): Promise<Category> {
    const { data, error } = await withTimeout(supabase
      .from('categories')
      .insert([{ name: name.trim(), parent_id }])
      .select()
      .single(), 'Creating category');

    if (error) throw new Error(`Ошибка при создании категории: ${error.message}`);
    return data;
  },

  // 3. Обновление
  async update(id: number, name: string, parent_id: number | null): Promise<Category> {
    const { data, error } = await withTimeout(supabase
      .from('categories')
      .update({ name: name.trim(), parent_id })
      .eq('id', id)
      .select()
      .single(), 'Updating category');

    if (error) throw new Error(`Ошибка при обновлении категории: ${error.message}`);
    return data;
  },

  // 4. Удаление
  async delete(id: number): Promise<Category | null> {
    const { data, error } = await withTimeout(supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select()
      .single(), 'Deleting category');

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Ошибка при удалении категории: ${error.message}`);
    }
    return data;
  }
};
