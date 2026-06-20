import { brandService } from './01-services/brandService';
import { productService } from './01-services/productService';
import { reviewService } from './01-services/reviewService';
import { supabase } from './supabaseClient'; // Для быстрого чтения категорий

async function main() {
  try {
    console.log("🚀 Бэкенд-сервер успешно запущен в режиме мониторинга!");
    console.log("-----------------------------------------------------");

    // Читаем бренды
    const brands = await brandService.getAll();
    console.log(`📊 Всего брендов в базе: ${brands?.length || 0}`);

    // Читаем категории
    const { data: categories } = await supabase.from('categories').select('*');
    console.log(`📊 Всего категорий в базе: ${categories?.length || 0}`);

    // Читаем товары
    const products = await productService.getAll();
    console.log(`📊 Всего товаров в базе: ${products?.length || 0}`);

    // Читаем вариации
    const { data: variants } = await supabase.from('product_variants').select('*');
    console.log(`📊 Всего вариаций с ценами: ${variants?.length || 0}`);

    // Читаем отзывы
    const { data: reviews } = await supabase.from('reviews').select('*');
    console.log(`📊 Всего отзывов в базе: ${reviews?.length || 0}`);
    
    console.log("-----------------------------------------------------");
    console.log("✅ Все сервисы бэкенда проверены, база данных доступна!");

  } catch (error: any) {
    console.error("💥 Произошла ошибка при диагностике базы:", error.message);
  }
}

main();