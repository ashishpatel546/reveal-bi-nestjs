import { Module, Global } from '@nestjs/common';
import { ApiConfigService } from './config/config.service';
import { DbConfig } from './config/dbConfig';
import { AwsConfig } from './config/awsconfig';

@Global()
@Module({
  providers: [ApiConfigService, DbConfig, AwsConfig],
  exports: [ApiConfigService, DbConfig, AwsConfig],
})
export class SharedModule {}
