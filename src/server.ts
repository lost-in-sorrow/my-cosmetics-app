import express from 'express';
import brandRoutes from './03-routes/brandRoutes';
import categoryRoutes from './03-routes/categoryRoutes';
import productRoutes from './03-routes/productRoutes';
import { errorHandler } from './06-middleware/errorHandler';
// По аналогии потом подключишь productRoutes

const app = express();
app.use(express.json());

// Подключаем наши модули роутов
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на http://localhost:${PORT}`);
});