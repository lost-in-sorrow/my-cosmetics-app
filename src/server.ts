import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import brandRoutes from './03-routes/brandRoutes';
import categoryRoutes from './03-routes/categoryRoutes';
import productRoutes from './03-routes/productRoutes';
import { swaggerSpec } from './05-config/swagger';
import { errorHandler } from './06-middleware/errorHandler';

const app = express();
const clientDir = path.resolve(__dirname, '../client');

app.use(express.json());
app.use(express.static(clientDir));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.get(/^\/(?!api(?:\/|$)|api-docs(?:\/|$)).*/, (_req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server started on http://localhost:${PORT}`);
});
