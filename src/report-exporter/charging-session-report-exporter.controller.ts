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

  // @ApiQuery({
  //   name: 'table',
  //   required: true,
  //   description: 'Give the table name from which we need to download the data',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   description:
  //     'Give the number of record to be downloaded, default limit is 500000',
  // })
  // @Get('/get-stream')
  // async getCsvStream(
  //   @Query('table') table: string,
  //   @Query('limit', ParseIntPipe) limit: number,
  //   @Res() res: Response,
  // ) {
  //   // return new StreamableFile(await this.service.getCsvStream(table, limit));
  //   res.setHeader('Content-Type', 'text/csv');
  //   res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
  //   const stream = await this.service.getCsvStream(table, limit);
  //   console.log(typeof stream);
  //   stream.pipe(res);
  // }

  //API route for download link

  @ApiResponse({ status: 200, description: 'Request Successfull', type: [ReportExporterResponse] })
  @ApiBody({
    description: 'Put all filters as api body',
    type: ChargingSessionFieldsDto,
  })
  @Post('/get-link')
  getReportLink(@Body() filters: ChargingSessionFieldsDto) {
    const {from, to} = filters
    const [fromDate, toDate] = dateValidation(from, to)
    const maxDate = moment(fromDate).add(12, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'Can generate report for max of 12 months of duration.',
      );
    }
    return this.service.getCsvReportLink(fromDate, toDate, filters);
  }
}
