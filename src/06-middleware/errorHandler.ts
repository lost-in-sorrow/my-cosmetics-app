import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);

  const message = typeof err.message === 'string' ? err.message : 'Internal server error';
  const isTimeout = message.includes('timed out');
  const isUpstreamHtmlError = message.includes('<!DOCTYPE html>') || message.includes('Cloudflare');
  const statusCode = err.status || (isTimeout ? 504 : isUpstreamHtmlError ? 502 : 500);

  res.status(statusCode).json({
    status: 'error',
    message: isUpstreamHtmlError ? 'Database service is unavailable' : message,
  });
};
