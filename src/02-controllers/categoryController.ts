import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../01-services/categoryService';

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const categories = await categoryService.getAll(page, limit);
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, parent_id } = req.body;
      const newCategory = await categoryService.create(name, parent_id || null);
      res.status(201).json(newCategory);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name, parent_id } = req.body;
      const updatedCategory = await categoryService.update(id, name, parent_id);
      
      if (!updatedCategory) {
        const error = new Error("Категория не найдена");
        (error as any).status = 404;
        throw error;
      }
      res.json(updatedCategory);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await categoryService.delete(id);
      res.status(204).send();
    } catch (err: any) {
      // Проверяем, не нарушило ли удаление constraint 'fk_parent' (RESTRICT)
      if (err.message && err.message.includes('fk_parent')) {
        res.status(400).json({ 
          error: "Нельзя удалить категорию, у которой есть подкатегории. Сначала удалите вложенные элементы." 
        });
      } else {
        next(err);
      }
    }
  }
};