import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GraphDataService } from './graph-data.service';
import { GraphDistinctValueRequestDto } from './dto/graphDistinctValueRequest.dto';

@ApiTags('Graph Data')
@Controller('graph-data')
export class GraphDataController {
    constructor(
        private readonly service: GraphDataService
    ){}

    @Post('/get-distinct-value-for-filters')
    getDistinctValue(@Body() reqBody: GraphDistinctValueRequestDto){
        return this.service.getDistinctValues(reqBody)
    }
}
