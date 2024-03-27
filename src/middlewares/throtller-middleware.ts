// throttler.middleware.ts

import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ThrottlerService } from 'src/throttler/throttler.service';

@Injectable()
export class ThrottlerMiddleware implements NestMiddleware {
  private logger = new Logger(ThrottlerMiddleware.name)
  private readonly requestCounts: Map<
    string,
    { count: number; lastRequest: number }
  > = new Map();

  constructor(private readonly throttled: ThrottlerService) {}
  use(req: Request, _res: Response, next: NextFunction) {
    const ip = req.ip;

    // Check if IP or user has exceeded the limit
    if (this.throttled.isThrottled(ip)) {
      throw new HttpException(
        'Last request is being processed.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
this.logger.debug(`Adding Ip to throtller: ${ip}`)
    this.throttled.addEntry(ip);
    next();
  }
}
