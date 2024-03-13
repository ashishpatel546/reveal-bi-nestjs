import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChargingSessionReportExporterService } from './charging-session-report-exporter.service';
import { Response } from 'express';
import { ChargingSessionFieldsDto } from './dtos/chargingSessionFields.dto';
import { ReportExporterResponse } from './dtos/reportApiResponse.dto';
import { dateValidation } from 'src/utilities/dateMethods';
import moment from 'moment';

@ApiTags('Charging Session Report Exporter')
@Controller('charging-session-report-exporter')
export class ChargingSessionReportExporterController {
  constructor(private readonly service: ChargingSessionReportExporterService) {}

  //API route for download link

  @ApiResponse({
    status: 200,
    description: 'Request Successfull',
    type: [ReportExporterResponse],
  })
  @ApiBody({
    description: 'Put all filters as api body',
    type: ChargingSessionFieldsDto,
  })
  @Post('/get-link')
  getReportLink(@Body() reqBody: ChargingSessionFieldsDto) {
    const { from, to, filters } = reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(12, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'Can generate report for max of 12 months of duration.',
      );
    }
    return this.service.getCsvReportLink(fromDate, toDate, filters);
  }

  @Post('/get-report-on-email')
  getReportViaEmail(@Body() reqBody: ChargingSessionFieldsDto) {
    const { from, to, filters, email } = reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(12, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'Can generate report for max of 12 months of duration.',
      );
    }
    return this.service.getCsvReportOnEmail(fromDate, toDate,email, filters);
  }
}
