import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChargingSessionReportExporterService } from './charging-session-report-exporter.service';
import { ChargingSessionFieldsDto } from './dtos/chargingSessionFields.dto';
import { ReportExporterResponse } from './dtos/reportApiResponse.dto';
import { dateValidation } from 'src/utilities/dateMethods';
import moment from 'moment';
import { checkValidEmailList } from 'src/utilities/sharedMethods';

@ApiTags('Charging Session Report Exporter')
@Controller('charging-session-report-exporter')
export class ChargingSessionReportExporterController {
  constructor(private readonly service: ChargingSessionReportExporterService) {}

  //API route for download link

  @Get('/get-all-columns')
  getAllColumns() {
    return this.service.getAllColuns();
  }

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
    const { from, to, filters, requestedFields } = reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(3, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'Can generate report for max of 3 months of duration.',
      );
    }
    return this.service.getCsvReportLink(
      fromDate,
      toDate,
      filters,
      requestedFields,
    );
  }

  @Post('/get-report-on-email')
  getReportViaEmail(@Body() reqBody: ChargingSessionFieldsDto) {
    const { from, to, filters, emailList, requestedFields } = reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(3, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'Can generate report for max of 3 months of duration.',
      );
    }
    const isValidEmailList = checkValidEmailList(emailList);
    if (!isValidEmailList)
      throw new BadRequestException('Emails are not valid');
    return this.service.getCsvReportOnEmail(
      fromDate,
      toDate,
      emailList,
      filters,
      requestedFields,
    );
  }
}
