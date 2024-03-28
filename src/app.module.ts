import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { validate } from './env-validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfig } from './shared/config/dbConfig';
import { RevealBiModule } from './reveal-bi/reveal-bi.module';
import { ReportExporterModule } from './report-exporter/report-exporter.module';
import { CsvWrapperModule } from './csvwrapper/csvwrapper.module';
import { AwsServiceModule } from './aws_service/aws_service.module';
import { DataExporterModule } from './data-exporter/charging-session-data-exporter.module';
import { GraphDataModule } from './graph-data/graph-data.module';
import { ThrottlerModule } from './throttler/throttler.module';
import { ThrottlerMiddleware } from './middlewares/throtller-middleware';
import { ChargingSessionReportExporterController } from './report-exporter/charging-session-report-exporter.controller';

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
    CsvWrapperModule,
    AwsServiceModule,
    DataExporterModule,
    GraphDataModule,
    ThrottlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ThrottlerMiddleware)
      .forRoutes(ChargingSessionReportExporterController);
  }
}
