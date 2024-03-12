import { Global, Module } from '@nestjs/common';
import {AwsS3Service } from './aws_s3_service.service';

@Global()
@Module({
  providers: [AwsS3Service],
  exports:[AwsS3Service]
})
export class AwsServiceModule {}
