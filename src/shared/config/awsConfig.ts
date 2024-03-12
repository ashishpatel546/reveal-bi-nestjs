import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

@Injectable({ scope: Scope.DEFAULT })
export class AwsConfig {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }
    return value;
  }

  private getString(key: string): string {
    return this.get(key).trim();
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return parseInt(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  get awsS3Accesskey() {
    return this.getString('AWS_S3_ACCESS_KEY');
  }

  get awsS3SecretKey() {
    return this.getString('DB_PASSWORD_REDSHIFT');
  }

  get awsS3Bucket() {
    return this.getString('AWS_S3_BUCKET');
  }

  get awsS3Region() {
    return this.getString('AWS_REGION');
  }

  get awsS3AllowedOrigin() {
    return this.getString('AWS_CORS_ALLOWED_ORIGINS');
  }

  get awsS3AllowedMethod() {
    return this.getString('AWS_CORS_ALLOWED_METHODS');
  }
}
