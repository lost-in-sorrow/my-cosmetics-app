import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';

type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export const reviewService = {
  // 1. Получить все отзывы для товара
  async getByProductId(productId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('variant_id', productId);
      
    if (error) throw new Error(`Ошибка при чтении отзывов: ${error.message}`);
    return data;
  },

  // 2. Добавить новый отзыв
  async create(reviewData: ReviewInsert) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select();
      
    if (error) throw new Error(`Ошибка при добавлении отзыва: ${error.message}`);
    return data;
  }
};