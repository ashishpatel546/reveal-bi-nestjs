import { Global, Module } from '@nestjs/common';
import { CsvWrapperService } from './csvwrapper.service';

@Global()
@Module({
  imports: [],
  providers: [CsvWrapperService],
  exports: [CsvWrapperService]
})
export class CsvWrapperModule {}
