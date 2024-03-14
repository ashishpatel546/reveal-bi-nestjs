import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
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

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get apiVersion(): string {
    return this.getString('API_VERSION');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get dataFetchLimit(): number {
    return this.getNumber('DATA_FETCH_LIMIT');
  }

  get maxPageSize(): number {
    return this.getNumber('MAX_PAGE_SIZE');
  }

  get getThrottleTTL(): number {
    return this.getNumber('THROTTLE_TTL');
  }

  get getThrottleLimit(): number {
    return this.getNumber('THROTTLE_LIMIT');
  }

  get getFromEmail(): string {
    return this.getString('FROM_EMAIL_ID');
  }

  get appConfig(): { port: number } {
    return {
      port: this.getNumber('SERVICE_PORT'),
    };
  }
}
