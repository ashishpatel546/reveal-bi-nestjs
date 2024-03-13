import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChargingSessionDataExporterService } from './charging-session-data-exporter.service';
import { ApiTags } from '@nestjs/swagger';
import { ChargingSessionRequestDto } from './dto/chargingSessionReq.dto';
import moment from 'moment';
import { dateValidation } from 'src/utilities/dateMethods';

@ApiTags('Charging Session Data Exporter')
@Controller('charging-session-data-exporter')
export class ChargingSessionDataExporterController {
  constructor(private readonly service: ChargingSessionDataExporterService) {}

  @Post('/get-data')
  getData(@Body() reqBody: ChargingSessionRequestDto) {
    const { from, to } = reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(12, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'Can generate report for max of 12 months of duration.',
      );
    }
    return this.service.getData(reqBody, fromDate, toDate);
  }
}
