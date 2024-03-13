import { Module } from '@nestjs/common';
import { ChargingSessionDataExporterController } from './data-exporter.controller';
import { ChargingSessionDataExporterService } from './charging-session-data-exporter.service';

@Module({
  controllers: [ChargingSessionDataExporterController],
  providers: [ChargingSessionDataExporterService]
})
export class DataExporterModule {}
