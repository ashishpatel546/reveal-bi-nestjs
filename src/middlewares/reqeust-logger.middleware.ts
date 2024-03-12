import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const logger = new Logger('LoggerMiddleware');
  logger.log(`Request recived on enpoints: ${req.url}`);
  next();
}
