import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';

// Вытаскиваем авто-тип для добавления вариации из нашей карты базы данных
type VariantInsert = Database['public']['Tables']['product_variants']['Insert'];

export const variantService = {
  // 1. Получить все вариации для конкретного товара
  async getByProductId(productId: number) {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId);
      
    if (error) throw new Error(`Ошибка при чтении вариаций: ${error.message}`);
    return data;
  },

  // 2. Создать новую вариацию (для оттенка, объема или цены)
  async create(variantData: VariantInsert) {
    const { data, error } = await supabase
      .from('product_variants')
      .insert([variantData])
      .select();
      
    if (error) throw new Error(`Ошибка при создании вариации: ${error.message}`);
    return data;
  }
};