import { Module } from '@nestjs/common';
import { ChargingSessionDataExporterController } from './data-exporter.controller';
import { ChargingSessionDataExporterService } from './charging-session-data-exporter.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [ChargingSessionDataExporterController],
  providers: [ChargingSessionDataExporterService]
})
export class DataExporterModule {}
