import express from 'express';
import { brandService } from './services/brandService';
import { productService } from './services/productService';

const app = express();
app.use(express.json()); // Чтобы сервер понимал JSON в запросах

// --- Маршруты (API Endpoints) ---

// Получить список всех брендов
app.get('/api/brands', async (req, res) => {
  const brands = await brandService.getAll();
  res.json(brands);
});

// Получить все товары
app.get('/api/products', async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
});

// Добавить товар (POST запрос)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 API сервер запущен на http://localhost:3000');
});