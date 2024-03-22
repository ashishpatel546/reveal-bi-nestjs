import { Module } from '@nestjs/common';
import { ThrottlerService } from './throttler.service';
import { ThrottlerController } from './throttler.controller';

@Module({
  providers: [ThrottlerService],
  exports: [ThrottlerService],
  controllers: [ThrottlerController]
})
export class ThrottlerModule {}
