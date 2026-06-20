import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';

// Вытаскиваем готовый тип для создания продукта, который сгенерировал Supabase
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export const productService = {
  // 1. Получить вообще все товары
  async getAll() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw new Error(`Ошибка при чтении товаров: ${error.message}`);
    return data;
  },

  // 2. Найти один товар по ID
  async getById(id: number) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw new Error(`Ошибка при поиске товара: ${error.message}`);
    return data;
  },

  // 3. Создать новый товар (теперь тип данных идеален на 100%)
  async create(productData: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
      
    if (error) throw new Error(`Ошибка при создании товара: ${error.message}`);
    return data;
  }
};