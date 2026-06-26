import { supabase } from '../05-config/supabaseClient';

export const productService = {
  async createFullProduct(productData: any, variantData: any) {
    // Валидация перед запросом
    if (!variantData.status) throw new Error("Вариант должен иметь статус");

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (productError) throw new Error(`Ошибка товара: ${productError.message}`);

    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .insert([{ ...variantData, product_id: product.id }])
      .select()
      .single();

    if (variantError) {
      await supabase.from('products').delete().eq('id', product.id);
      throw new Error(`Ошибка варианта: ${variantError.message}`);
    }

    return { ...product, variant };
  },

  async addVariant(product_id: number, variantData: any) {
    if (!variantData.status) throw new Error("Вариант должен иметь статус");
    
    const { data, error } = await supabase
      .from('product_variants')
      .insert([{ ...variantData, product_id }])
      .select()
      .single();

    if (error) throw new Error(`Ошибка добавления варианта: ${error.message}`);
    return data;
  },

  async getAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants (*)')
      .range(offset, offset + limit - 1)
      .order('id', { ascending: false });

    if (error) throw new Error(`Ошибка получения: ${error.message}`);
    
    // Возвращаем только товары с вариантами
    return (data || []).filter(p => p.product_variants?.length > 0);
  },

  async updateProduct(id: number, data: any) {
    const { data: updated, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Ошибка обновления товара: ${error.message}`);
    return updated;
  },

  async updateVariant(variantId: number, data: any) {
    const { data: updated, error } = await supabase
      .from('product_variants')
      .update(data)
      .eq('id', variantId)
      .select()
      .single();
    if (error) throw new Error(`Ошибка обновления варианта: ${error.message}`);
    return updated;
  },

  async updateVariantStatus(variantId: number, status: 'finished' | 'expired') {
    const { data, error } = await supabase
      .from('product_variants')
      .update({ status })
      .eq('id', variantId)
      .select()
      .single();

    if (error) throw new Error(`Ошибка статуса: ${error.message}`);
    return data;
  }
};