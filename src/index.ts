// src/index.ts

// Создаем строгий тип для статуса нашей косметики (один в один как в Supabase!)
type ProductStatus = 'new' | 'in_use' | 'finished' | 'expired';

interface BeautyProduct {
    id: number;
    name: string;
    status: ProductStatus;
    volume: number;
}

const myLipstick: BeautyProduct = {
    id: 1,
    name: "Color Drops",
    status: 'new', // Попробуй изменить на 'wow' — редактор сразу начнет ругаться!
    volume: 15
};

console.log(`Ура! Наш продукт ${myLipstick.name} успешно запущен на TypeScript!`);