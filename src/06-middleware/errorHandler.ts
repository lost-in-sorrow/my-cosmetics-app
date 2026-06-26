import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Ошибка:', err.message);

  // Определяем статус ошибки
  const statusCode = err.status || 500;

  // Отправляем ответ
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Внутренняя ошибка сервера',
  });
};