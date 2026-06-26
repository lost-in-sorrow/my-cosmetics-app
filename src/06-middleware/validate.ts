// src/06-middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    // Вместо result.error.errors используем .issues
    const errorMessage = result.error.issues[0].message;
    
    const error = new Error(errorMessage);
    (error as any).status = 400;
    return next(error);
  }
  
  next();
};