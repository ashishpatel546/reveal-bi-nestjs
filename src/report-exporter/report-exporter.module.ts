import { Module } from '@nestjs/common';
import { ChargingSessionReportExporterController } from './charging-session-report-exporter.controller';
import { ChargingSessionReportExporterService } from './charging-session-report-exporter.service';
import { ThrottlerModule } from 'src/throttler/throttler.module';

@Module({
  imports :[ThrottlerModule],
  controllers: [ChargingSessionReportExporterController],
  providers: [ChargingSessionReportExporterService],
})
export class ReportExporterModule {}
