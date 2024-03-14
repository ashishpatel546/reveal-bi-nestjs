import { Module } from '@nestjs/common';
import { ChargingSessionDataExporterController } from './data-exporter.controller';
import { ChargingSessionDataExporterService } from './charging-session-data-exporter.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingSession } from 'src/entities/redshift/charging-session.entity';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([ChargingSession], 'Redshift'),
  ],
  controllers: [ChargingSessionDataExporterController],
  providers: [ChargingSessionDataExporterService],
})
export class DataExporterModule {}
