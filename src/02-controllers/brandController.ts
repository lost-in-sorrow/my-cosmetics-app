import { Request, Response, NextFunction } from 'express';
import { brandService } from '../01-services/brandService';

export const brandController = {
  // Получить все бренды
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.getAll();
      res.json(brands);
    } catch (err) {
      next(err);
    }
  },

  // Создать новый бренд
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Валидация уже прошла в мидлваре, работаем с чистыми данными
      const brand = await brandService.findOrCreate(req.body.name);
      res.status(201).json(brand);
    } catch (err) {
      next(err);
    }
  },

  // Обновить бренд
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        const error = new Error("Некорректный формат ID");
        (error as any).status = 400;
        throw error;
      }
      
      const updatedBrand = await brandService.update(id, req.body);
      if (!updatedBrand) {
        const error = new Error("Бренд не найден");
        (error as any).status = 404;
        throw error;
      }
      
      res.json(updatedBrand);
    } catch (err) {
      next(err);
    }
  },

  // Удалить бренд
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        const error = new Error("Некорректный формат ID");
        (error as any).status = 400;
        throw error;
      }

      const deleted = await brandService.delete(id);
      
      if (!deleted) {
        const error = new Error("Бренд не найден");
        (error as any).status = 404;
        throw error;
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};