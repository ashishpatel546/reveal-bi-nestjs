import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  Scope,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// import { Filters } from './dtos/chargingSessionFields.dto';
import {
  checkArrayElementsMatch,
  idArrayToString,
  processStringToCleanString,
} from 'src/utilities/sharedMethods';
import moment from 'moment';
import { CsvWrapperService } from 'src/csvwrapper/csvwrapper.service';
import { AwsS3Service } from 'src/aws_service/aws_s3_service.service';
import { ApiConfigService } from 'src/shared/config/config.service';
import { EmailService } from 'src/email/email.service';
import { ChargingSession } from 'src/entities/redshift/charging-session.entity';
import { Filter } from './dtos/filter.dto';
import { isValidTimestamp } from 'src/utilities/dateMethods';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ThrottlerMiddleware } from 'src/middlewares/throtller-middleware';
import { ThrottlerService } from 'src/throttler/throttler.service';

@Injectable({ scope: Scope.REQUEST })
export class ChargingSessionReportExporterService {
  private logger = new Logger(ChargingSessionReportExporterService.name);
  private limit = this.apiConfig.dataFetchLimit;
  private readonly serverUrl = `${this.request.protocol}://${this.request.get(
    'host',
  )}`;

  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
    private readonly csvWrapper: CsvWrapperService,
    private readonly awsS3: AwsS3Service,
    private readonly apiConfig: ApiConfigService,
    private readonly emailService: EmailService,
    @Inject(REQUEST) private readonly request: Request,
    private readonly throttledService: ThrottlerService,
  ) {}

  private async mapRawTodata(dataArray: object[]) {
    if (!dataArray || dataArray.length === 0) return [];

    // convert all instance of date into proper format like 'YYYY-MM-DD HH:mm:ss'
    try {
      return dataArray.map((record) => {
        for (const key in record) {
          const value = record[key];
          if (isValidTimestamp(value) && moment(new Date(value)).isValid()) {
            record[key] = moment(new Date(value)).format('YYYY-DD-MM HH:mm:ss');
          }
        }
        return record;
      });
    } catch (error) {
      this.throttledService.deleteEntry(this.request.ip);
      this.logger.error(error.message);
      this.logger.error('Unable to map data to proper format');
    }
  }

  private async generateReportData(query: string) {
    const reportArray: unknown[] = [];
    const limit = this.limit;
    let processed = 0;
    while (true) {
      const customQuery = `${query} offset ${processed} limit ${limit}`;
      this.logger.log(`[CUSTOM QUERY: ] ${customQuery}`);
      try {
        const data: object[] = await this.redshift.query(customQuery);
        if (!data || data?.length === 0) break;
        const mappedData = await this.mapRawTodata(data);
        reportArray.push(...mappedData);
      } catch (error) {
        this.throttledService.deleteEntry(this.request.ip);
        this.logger.error('Unable to fetch data from server');
        this.logger.error(error.message);
        return null;
      }
      processed += limit;
    }
    return reportArray;
  }

  //todo need to work on it
  private emptyReportDataHandler(email: string[]) {
    this.logger.log(`There is no data for upload.`);
    const subject = `Report Download Request`;
    const body = `<h2>Hello!</h2>
    <p>Data is not available for your request criteria</p>
    <p>If you have any questions, feel free to contact us.</p>
    <p>Best regards,<br>Blink Charging<br>Charge on</p>`;
    return this.emailService.sendEmailText(email, subject, body);
  }

  private async generateAndUploadReport(
    query: string,
    uploadPath: string,
    emails?: string[],
  ) {
    const reqStartTime = new Date();
    let report = await this.generateReportData(query);
    if (!report || report?.length === 0) {
      this.emptyReportDataHandler(emails);
      this.throttledService.deleteEntry(this.request.ip);
      return;
    }
    this.logger.log(`No of records for the file is: ${report?.length ?? 0}`);

    this.logger.log(
      `Uploading!!! Report for to S3, path/file_name: ${uploadPath}`,
    );

    //handle small files as multipart has limit of min 5mb file
    if (report?.length < 15000) {
      this.logger.log('Handling small files for approx size less than 5mb');
      const csv = this.csvWrapper.jsonToCsvBuffer(report);
      await this.awsS3.uploadfileInCsv(uploadPath, csv);
    } else {
      this.logger.log('Handling large files for approx size greater than 5mb');
      await this.awsS3.uploadCsvToS3InChunks(uploadPath, report);
    }
    const reqProcessedTimestamp = new Date();
    const timeTakenToProcess = moment(reqProcessedTimestamp).diff(
      reqStartTime,
      'minute',
    );
    this.logger.log(
      `${report.length} records processed in ${
        timeTakenToProcess ? timeTakenToProcess : 'lest than 1'
      } minutes`,
    );
    this.logger.log('!!!Uploading finished....');
    this.logger.log(`File is available on s3 via link provided...`);
    this.throttledService.deleteEntry(this.request.ip);
    report = null;
    return;
  }

  private addFiltersToQuery(query: string, filters: Filter[]) {
    for (const filter of filters) {
      const filterName = filter.fieldName;
      const filterValue = filter.values;
      if (!filterValue || filterValue.length === 0) continue;
      if (
        filterValue.includes('all') ||
        filterValue.includes('All') ||
        filterValue.includes('ALL')
      ) {
        continue;
      }
      if (
        query.includes('where') ||
        query.includes('WHERE') ||
        query.includes('Where')
      )
        query += ` and`;
      else query += `where`;
      const fieldValueString = idArrayToString(filterValue);
      query += ` ${filterName} in (${fieldValueString}) `;
    }
    return query;
  }

  private buildQuerywithRequestedFields(
    requestedFields: string[],
    tableName: string,
  ) {
    let newQuery = 'SELECT ';
    if (requestedFields && requestedFields.length > 0) {
      // Extract field names from requestedFields and join them with commas
      const fieldNames = requestedFields.map((field) => field).join(', ');
      newQuery += fieldNames;
    } else {
      // If requestedFields array is empty or undefined, select all fields with *
      newQuery += '*';
    }
    newQuery += ` from ${tableName}`;
    return newQuery;
  }

  private queryBuilder(
    from: Date,
    to: Date,
    filters: Filter[] =[],
    requestedFields: string[],
  ) {
    const classElements = this.redshift
      .getMetadata(ChargingSession)
      .ownColumns.map((column) => column.propertyName);
    const { isMatched, unmatchedFields } = checkArrayElementsMatch(
      requestedFields,
      classElements,
    );
    if (!isMatched) {
      this.throttledService.deleteEntry(this.request.ip);
      throw new BadRequestException({
        'Unmatched Fields': unmatchedFields,
        description:
          'All requested fields are not exist in charging Session cube',
      });
    }
    const filterKeys = filters?.map((f) => f.fieldName);
    const {
      isMatched: isFIlterKeysMatched,
      unmatchedFields: filterUnmatchedFields,
    } = checkArrayElementsMatch(filterKeys, classElements);
    if (!isFIlterKeysMatched) {
      this.throttledService.deleteEntry(this.request.ip);
      throw new BadRequestException({
        'Unmatched Fields': filterUnmatchedFields,
        description:
          'All requested fields are not exist in charging Session cube',
      });
    }

    // let query = 'SELECT ';

    // Check if requestedFields array exists and has elements
    // if (requestedFields && requestedFields.length > 0) {
    //   // Extract field names from requestedFields and join them with commas
    //   const fieldNames = requestedFields.map((field) => field).join(', ');
    //   query += fieldNames;
    // } else {
    //   // If requestedFields array is empty or undefined, select all fields with *
    //   query += '*';
    // }
    // query = query + ` from charging_session `;

    let query = this.buildQuerywithRequestedFields(
      requestedFields,
      'charging_session',
    );

    //add dates for which data required
    const fromString = moment(from).format('YYYY-MM-DD');
    const toString = moment(to).format('YYYY-MM-DD');
    const appendQuery = ` where Date(post_date) between '${fromString}' and '${toString}'`;
    query += appendQuery;

    // for (const key of Object.keys(filters)) {
    //   if (filters[key]?.length === 0) continue;

    //   const keyString = idArrayToString(filters[key]);
    //   const appendQuery = ` and ${key} in (${keyString})`;
    //   query += appendQuery;
    // }
    query = this.addFiltersToQuery(query, filters);
    query = query + ` order by post_date `;
    this.logger.log(`[GENERIC QUERY: ] ${query}`);

    return query;
  }

  async getCsvReportLink(
    from: Date,
    to: Date,
    filters: Filter[],
    requestedFields?: string[],
    reportName: string = 'report',
  ) {
    const query = this.queryBuilder(from, to, filters, requestedFields);
    const s3folder = `REPORT_EXPORTER/CHARGING_SESSION`;
    const uploadPath = `${s3folder}/${reportName}_${moment().format(
      'DDMMYYYYhhmmss',
    )}.csv`;

    const download_url = this.awsS3.getSignedUrl(uploadPath, 48 * 60 * 60);
    const encryptedUrl = this.awsS3.encryptUrl(download_url);
    const responseUrl = `${this.serverUrl}/v${this.apiConfig.apiVersion}/charging-session-report-exporter/download-file/${encryptedUrl}`;
    this.generateAndUploadReport(query, uploadPath);
    return {
      message: `You have requested report that is quite large and we have generated the link, please click on that link to download the report. Report will be available soon on that link and link is valid for 48 hours from now.`,
      status_codes: {
        200: 'Report is Available',
        404: 'Report is being generated, Please Wait',
        403: 'Report expired',
      },
      url: responseUrl,
      encryptedUrl,
    };
  }

  async getCsvReportOnEmail(
    from: Date,
    to: Date,
    emails: string[],
    filters: Filter[],
    requestedFields?: string[],
    reportName: string = 'report',
  ) {
    const query = this.queryBuilder(from, to, filters, requestedFields);
    const s3folder = `REPORT_EXPORTER/CHARGING_SESSION`;
    const uploadPath = `${s3folder}/${reportName}_${moment().format(
      'DDMMYYYYhhmmss',
    )}.csv`;
    const download_url = this.awsS3.getSignedUrl(uploadPath, 48 * 60 * 60);
    const encryptedUrl = this.awsS3.encryptUrl(download_url);
    const responseUrl = `${this.serverUrl}/v${this.apiConfig.apiVersion}/charging-session-report-exporter/download-file/${encryptedUrl}`;
    // this.generateAndUploadReport(query, uploadPath);
    this.generateAndUploadReport(query, uploadPath, emails)
      .then(() => {
        const emailHtml = `<h2>Hello!</h2>
        <p>Your download is ready. Click the button below to download:</p>
        <p><a href="${responseUrl}" target="_blank" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 30px; display: inline-block;">Download Now</a></p>
        <p>If you have any questions, feel free to contact us. Link is valid till 48 hours</p>
        <p>Best regards,<br>Blink Charging<br>Charge on</p>`;
        const subject = `Report is Ready to download!`;
        return this.emailService.sendEmailText(emails, subject, emailHtml);
      })
      .then((res) => {
        if (res === 'success') this.logger.log(`Email sent successfully`);
        else this.logger.log('Email sending failed');
      })
      .catch((err) => {
        this.logger.error(err.message);
        this.throttledService.deleteEntry(this.request.ip);
      });
    return {
      msg: 'SUCCESS',
      description:
        'We are processing your request. You will get an email shortly once report is available. Link is valid for 48 hours',
    };
  }

  getAllColuns() {
    try {
      const columns = this.redshift
        .getMetadata(ChargingSession)
        .ownColumns.map((column) => column.propertyName);
      this.throttledService.deleteEntry(this.request.ip);
      return columns;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to fetch columns list');
      this.throttledService.deleteEntry(this.request.ip);
      throw new InternalServerErrorException(error.message);
    }
  }
}
