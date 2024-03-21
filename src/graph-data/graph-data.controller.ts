import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GraphDataService } from './graph-data.service';
import { GraphDistinctValueRequestDto } from './dto/graphDistinctValueRequest.dto';
import { GraphDataRequestDto } from './dto/graph-data-request.dto';
import { ChargingSessionGraphDataProiver } from './charging-session-graph-data.provider';

@ApiTags('Graph Data')
@Controller('graph-data')
export class GraphDataController {
    constructor(
        private readonly service: GraphDataService,
        private readonly chargingSessionProvider: ChargingSessionGraphDataProiver
    ){}

    @Post('/get-distinct-value-for-filters')
    getDistinctValue(@Body() reqBody: GraphDistinctValueRequestDto){
        return this.service.getDistinctValues(reqBody)
    }

    @Post('/get-data')
    getData(@Body() reqData: GraphDataRequestDto){
        return this.service.getData(reqData)
    }
}
