import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import compression from 'compression';
import {
  ValidationPipe,
  HttpStatus,
  UnprocessableEntityException,
  Logger,
  VersioningType,
} from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ApiConfigService } from './shared/config/config.service';
import { setupSwagger } from './setupSwagger';
import { loggerMiddleware } from './middlewares/reqeust-logger.middleware';
import { getHeapStatistics } from 'v8';
import { RevealBiMiddleware } from './middlewares/reveal-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(loggerMiddleware);
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors({ origin: '*' });
  const configService = app.select(SharedModule).get(ApiConfigService);

  //Reveal BI middleware
  app.use('/reveal-bi-server', RevealBiMiddleware);

  //set api version
  const apiVersion = configService.apiVersion;
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const port = configService.appConfig.port;

  await app.listen(port);
  Logger.log(`Server is listening on ${await app.getUrl()}`);

  const totalHeapSize = getHeapStatistics().total_available_size;
  const totalHeapSizaInMB = (totalHeapSize / 1024 / 1024).toFixed(2);
  Logger.log(`Total Memory for the process is set to: ${totalHeapSizaInMB}`);
}
bootstrap();
