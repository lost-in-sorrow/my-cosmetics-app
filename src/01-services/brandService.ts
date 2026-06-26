import { supabase } from '../05-config/supabaseClient';
import { Tables } from '../04-types/supabase';

type Brand = Tables<'brands'>;

export const brandService = {
  // 1. Универсальный getAll с пагинацией
  async getAll(page?: number, limit?: number): Promise<Brand[]> {
    let query = supabase.from('brands').select('*').order('id', { ascending: true });

    if (page !== undefined && limit !== undefined) {
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Ошибка при получении брендов: ${error.message}`);
    return data || [];
  },

  // 2. Умный поиск или создание
  async findOrCreate(name: string): Promise<Brand> {
    const displayName = name.trim();
    if (!displayName) throw new Error("Название бренда не может быть пустым");

    const { data: existing, error: searchError } = await supabase
      .from('brands')
      .select('*')
      .ilike('name', displayName)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      throw new Error(`Ошибка при поиске бренда: ${searchError.message}`);
    }
    if (existing) return existing;

    const { data: newBrand, error: insertError } = await supabase
      .from('brands')
      .insert([{ name: displayName }])
      .select()
      .single();
    
    if (insertError) throw new Error(`Ошибка при создании бренда: ${insertError.message}`);
    return newBrand;
  },

  // 3. Обновление
  async update(id: number, data: { name: string }): Promise<Brand> {
    const { data: updatedBrand, error } = await supabase
      .from('brands')
      .update({ name: data.name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedBrand;
  },

  // 4. Удаление
  async delete(id: number): Promise<Brand | null> {
    const { data, error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Ошибка при удалении: ${error.message}`);
    }
    return data;
  }
};