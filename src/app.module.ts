import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { validate } from './env-validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from './shared/config/dbConfig';
import { RevealBiModule } from './reveal-bi/reveal-bi.module';
import { RevealBiController } from './reveal-bi/reveal-bi.controller';
import { ReportExporterModule } from './report-exporter/report-exporter.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
      validate,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'Redshift',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig_Redshift(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfig],
      name: 'Redshift_Greece',
      useFactory: (configService: DbConfig) =>
        configService.getPostGresConfig_Redshift_Greece(),
    }),
    RevealBiModule,
    ReportExporterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}