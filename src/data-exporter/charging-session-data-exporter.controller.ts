import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { ChargingSessionDataExporterService } from './charging-session-data-exporter.service';
import { ApiTags } from '@nestjs/swagger';
import { ChargingSessionRequestDto } from './dto/chargingSessionReq.dto';
import moment from 'moment';
import { dateValidation } from 'src/utilities/dateMethods';
import { ChargingSessionDataResponse } from './interface/dataResponse.dto';
import { ResponseStatus } from 'src/glolbal-interfaces/status';

@ApiTags('Charging Session Data Exporter')
@Controller('charging-session-data-exporter')
export class ChargingSessionDataExporterController {
  constructor(private readonly service: ChargingSessionDataExporterService) {}

  @Get('/get-all-columns')
  getAllColumns() {
    return this.service.getAllColuns();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('/get-data')
  getData(
    @Body() reqBody: ChargingSessionRequestDto,
  ): Promise<ResponseStatus<ChargingSessionDataResponse>> {
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
