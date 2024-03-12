import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RevealBiController } from './reveal-bi.controller';
import { RevealBiService } from './reveal-bi.service';

@Module({
  controllers: [RevealBiController],
  providers: [RevealBiService]
})
export class RevealBiModule{
  
}
