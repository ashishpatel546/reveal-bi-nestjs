import { Module } from '@nestjs/common';
import { ChargingSessionReportExporterController } from './charging-session-report-exporter.controller';
import { ChargingSessionReportExporterService } from './charging-session-report-exporter.service';

@Module({
  controllers: [ChargingSessionReportExporterController],
  providers: [ChargingSessionReportExporterService],
})
export class ReportExporterModule {}
