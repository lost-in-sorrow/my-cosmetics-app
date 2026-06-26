import { Request, Response, NextFunction } from 'express';
import { productService } from '../01-services/productService';

export const productController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, brand_id, category_id, description, ...variantData } = req.body;
      if (!name || !brand_id || !category_id) throw new Error("Не все поля продукта заполнены");
      
      const result = await productService.createFullProduct({ name, brand_id, category_id, description }, variantData);
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  async addVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const newVariant = await productService.addVariant(Number(req.params.id), req.body);
      res.status(201).json(newVariant);
    } catch (err) { next(err); }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAll(Number(req.query.page) || 1, Number(req.query.limit) || 10);
      res.json(products);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await productService.updateProduct(Number(req.params.id), req.body);
      res.json(updated);
    } catch (err) { next(err); }
  },

  async updateVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await productService.updateVariant(Number(req.params.variantId), req.body);
      res.json(updated);
    } catch (err) { next(err); }
  },

  async markVariantAsFinished(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await productService.updateVariantStatus(Number(req.params.variantId), 'finished');
      res.json(updated);
    } catch (err) { next(err); }
  },

  async markVariantAsExpired(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await productService.updateVariantStatus(Number(req.params.variantId), 'expired');
      res.json(updated);
    } catch (err) { next(err); }
  }
};