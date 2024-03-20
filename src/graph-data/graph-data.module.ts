import { Module } from '@nestjs/common';
import { GraphDataController } from './graph-data.controller';
import { GraphDataService } from './graph-data.service';
import { ChargingSessionGraphDataProiver } from './charging-session-graph-data.provider';

@Module({
  controllers: [GraphDataController],
  providers: [GraphDataService, ChargingSessionGraphDataProiver]
})
export class GraphDataModule {}
