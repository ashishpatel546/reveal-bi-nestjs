import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChargingSessionReportExporterService } from './charging-session-report-exporter.service';
import { ChargingSessionFieldsDto } from './dtos/chargingSessionFields.dto';
import { ReportExporterResponse } from './dtos/reportApiResponse.dto';
import { dateValidation } from 'src/utilities/dateMethods';
import moment from 'moment';
import { checkValidEmailList } from 'src/utilities/sharedMethods';
import { AwsS3Service } from 'src/aws_service/aws_s3_service.service';
import {Response} from 'express'
@ApiTags('Charging Session Report Exporter')
@Controller('charging-session-report-exporter')
export class ChargingSessionReportExporterController {
  constructor(private readonly service: ChargingSessionReportExporterService,
    private readonly awsS3 : AwsS3Service) {}

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
    const { from, to, filters, requestedFields, report_name } = reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(4, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'From and To date can be in the range of 4 months',
      );
    }
    return this.service.getCsvReportLink(
      fromDate,
      toDate,
      filters,
      requestedFields,
      report_name,
    );
  }

  @Post('/get-report-on-email')
  getReportViaEmail(@Body() reqBody: ChargingSessionFieldsDto) {
    const { from, to, filters, emailList, requestedFields, report_name } =
      reqBody;
    const [fromDate, toDate] = dateValidation(from, to);
    const maxDate = moment(fromDate).add(4, 'M');
    if (moment(fromDate).isAfter(maxDate)) {
      throw new BadRequestException(
        'From and To date can be in the range of 4 months',
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
      report_name,
    );
  }

  @Get('/download-file/:encryptedUrl')
  downloadFile(
    @Param('encryptedUrl') encryptedUrl: string,
    @Res() res: Response,
  ) {
    const preSignedUrl = this.awsS3.decryptUrl(encryptedUrl);
    // Redirect user to pre-signed URL
    res.redirect(preSignedUrl)
  }
}
