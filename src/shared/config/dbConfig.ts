import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

@Injectable({ scope: Scope.DEFAULT })
export class DbConfig {
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

  get isSyncronization(): boolean {
    return this.getBoolean('IS_SYNCRONIZATION');
  }

  getPostGresConfig_Redshift(): TypeOrmModuleOptions {
    const migrations = ['dist/src/migrations/*{.ts, .js}'];
    return {
      type: 'postgres',
      migrations,
      host: this.getString('DB_HOST_REDSHIFT'),
      port: this.getNumber('DB_PORT_REDSHIFT'),
      username: this.getString('DB_USERNAME_REDSHIFT'),
      password: this.getString('DB_PASSWORD_REDSHIFT'),
      database: this.getString('DB_NAME_REDSHIFT'),
      logging: this.getBoolean('ENABLE_ORM_LOGS_REDSHIFT'),
      autoLoadEntities: true,
      synchronize: this.isSyncronization,
      poolSize: 20,
    };
  }

  getPostGresConfig_Redshift_Greece(): TypeOrmModuleOptions {
    // const entities = ['./**/*.entity{.js, .ts}'];

    const migrations = ['dist/src/migrations/*{.ts, .js}'];
    return {
      type: 'postgres',
      migrations,
      host: this.getString('DB_HOST_REDSHIFT'),
      port: this.getNumber('DB_PORT_REDSHIFT'),
      username: this.getString('DB_USERNAME_REDSHIFT'),
      password: this.getString('DB_PASSWORD_REDSHIFT'),
      database: this.getString('DB_NAME_REDSHIFT_GREECE'),
      logging: this.getBoolean('ENABLE_ORM_LOGS_REDSHIFT'),
      autoLoadEntities: true,
      synchronize: this.isSyncronization,
      poolSize: 20,
    };
  }

  get redshiftUserName() {
    return this.getString('DB_USERNAME_REDSHIFT');
  }

  get redshiftPassword() {
    return this.getString('DB_PASSWORD_REDSHIFT');
  }

  get redshiftHost() {
    return this.getString('DB_HOST_REDSHIFT');
  }

  get redshiftPort() {
    return this.getNumber('DB_PORT_REDSHIFT');
  }

  get redshiftDefaultDatabase() {
    return this.getString('DB_NAME_REDSHIFT');
  }
}
