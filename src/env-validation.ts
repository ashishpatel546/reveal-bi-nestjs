import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsPort,
  IsString,
  validateSync,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  qa = 'qa',
  stage = 'stage',
}

enum Boolean {
  true = 'true',
  false = 'false',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsPort()
  @IsNotEmpty()
  SERVICE_PORT: string;

  @IsString()
  @IsNotEmpty()
  API_VERSION: string;

  @IsEnum(Boolean)
  @IsNotEmpty()
  POSTMAN_CONFIG_ENABLED: boolean;

  @IsEnum(Boolean)
  @IsNotEmpty()
  ENABLE_DOCUMENTATION: boolean;

  @IsString()
  @IsNotEmpty()
  DB_HOST_REDSHIFT: string;

  @IsPort()
  @IsNotEmpty()
  DB_PORT_REDSHIFT: number;

  @IsPort()
  @IsNotEmpty()
  DB_POOL_SIZE: number;

  @IsString()
  @IsNotEmpty()
  DB_NAME_REDSHIFT: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME_REDSHIFT_GREECE: string;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME_REDSHIFT: string;

  // @IsStrongPassword()
  @IsNotEmpty()
  DB_PASSWORD_REDSHIFT: string;

  @IsEnum(Boolean)
  @IsNotEmpty()
  IS_SYNCRONIZATION: boolean;

  @IsEnum(Boolean)
  @IsNotEmpty()
  ENABLE_ORM_LOGS_REDSHIFT: boolean;

  @IsString()
  @IsNotEmpty()
  AWS_S3_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  AWS_S3_KEY_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AWS_S3_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  AWS_CORS_ALLOWED_ORIGINS: string;

  @IsString()
  @IsNotEmpty()
  AWS_CORS_ALLOWED_METHODS: string;

  @IsString()
  @IsNotEmpty()
  AWS_S3_URL_ENCRYPT_KEY: string;

  @IsString()
  @IsNotEmpty()
  DATA_FETCH_LIMIT: string;

  @IsString()
  @IsNotEmpty()
  MAX_PAGE_SIZE: string;

  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsString()
  @IsNotEmpty()
  MAIL_USER: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string;

  @IsNotEmpty()
  @IsEmail()
  FROM_EMAIL_ID: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    Logger.error(errors.toString());
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
