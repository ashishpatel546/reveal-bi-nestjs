import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Filters } from './dtos/chargingSessionFields.dto';
import {
  idArrayToString,
  isElementsMatchClassProperties,
  processStringToCleanString,
} from 'src/utilities/sharedMethods';
import moment from 'moment';
import { CsvWrapperService } from 'src/csvwrapper/csvwrapper.service';
import { AwsS3Service } from 'src/aws_service/aws_s3_service.service';
import { ApiConfigService } from 'src/shared/config/config.service';
import { EmailService } from 'src/email/email.service';
import { ChargingSession } from 'src/entities/redshift/charging-session.entity';

@Injectable()
export class ChargingSessionReportExporterService {
  private logger = new Logger(ChargingSessionReportExporterService.name);
  private limit = this.apiConfig.dataFetchLimit;

  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
    private readonly csvWrapper: CsvWrapperService,
    private readonly awsS3: AwsS3Service,
    private readonly apiConfig: ApiConfigService,
    private readonly emailService: EmailService,
  ) {}

  private async mapRawTodata(dataArray: object[]) {
    const mappedData: unknown[] = [];
    if (!dataArray || dataArray.length === 0) return mappedData;
    for (const data of dataArray) {
      const record = {
        ...data,
        created_on:
          moment(data['created_on'])?.format(`YYYY-MM-DD HH:mm:ss`) ?? '',
        updated_on:
          moment(data['updated_on'])?.format(`YYYY-MM-DD HH:mm:ss`) ?? '',
        session_created_on:
          moment(data['session_created_on'])?.format(`YYYY-MM-DD HH:mm:ss`) ??
          '',
        session_updated_on: data['session_updated_on']
          ? moment(data['session_updated_on'])?.format(`YYYY-MM-DD HH:mm:ss`)
          : '',
        connection_time: data['connection_time']
          ? moment(data['connection_time'])?.format(`YYYY-MM-DD HH:mm:ss`)
          : '',
        disconnect_time: data['disconnect_time']
          ? moment(data['disconnect_time'])?.format(`YYYY-MM-DD HH:mm:ss`)
          : '',
        charge_start: data['charge_start']
          ? moment(data['charge_start'])?.format(`YYYY-MM-DD HH:mm:ss`)
          : '',
        charge_end: data['charge_end']
          ? moment(data['charge_end'])?.format(`YYYY-MM-DD HH:mm:ss`)
          : '',
        post_date: data['post_date']
          ? moment(data['post_date'])?.format(`YYYY-MM-DD HH:mm:ss`)
          : '',
        address_line1: processStringToCleanString(data['address_line1']),
        address_line2: processStringToCleanString(data['address_line2']),
      };
      mappedData.push(record);
    }
    return mappedData;
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
    report = null;
    return;
  }

  private queryBuilder(from: Date, to: Date, filters: Filters) {
    let query = `select * from charging_session`;

    const fromString = moment(from).format('YYYY-MM-DD');
    const toString = moment(to).format('YYYY-MM-DD');
    const appendQuery = ` where Date(post_date) between '${fromString}' and '${toString}'`;
    query += appendQuery;

    for (const key of Object.keys(filters)) {
      if (filters[key]?.length === 0) continue;

      const keyString = idArrayToString(filters[key]);
      const appendQuery = ` and ${key} in (${keyString})`;
      query += appendQuery;
    }
    query = query + ` order by post_date `;
    this.logger.log(`[GENERIC QUERY: ] ${query}`);
    return query;
  }

  async getCsvReportLink(from: Date, to: Date, filters: Filters) {
    const query = this.queryBuilder(from, to, filters);
    const s3folder = `REPORT_EXPORTER/CHARGING_SESSION`;
    const uploadPath = `${s3folder}/report_${moment().format(
      'DDMMYYYYhhmmss',
    )}.csv`;
    const download_url = this.awsS3.getSignedUrl(uploadPath, 48 * 60 * 60);
    this.generateAndUploadReport(query, uploadPath);
    return {
      message: `You have requested report that is quite large and we have generated the link, please click on that link to download the report. Report will be available soon on that link and link is valid for 48 hours from now.`,
      status_codes: {
        200: 'Report is Available',
        404: 'Report is being generated, Please Wait',
        403: 'Report expired',
      },
      url: download_url,
    };
  }

  async getCsvReportOnEmail(
    from: Date,
    to: Date,
    emails: string[],
    filters: Filters,
    requestedFields?: string[],
  ) {
    const isAllRequestedFieldsAvailable = isElementsMatchClassProperties(
      ChargingSession,
      requestedFields,
    );
    if (!isAllRequestedFieldsAvailable)
      throw new BadRequestException(
        'All requested fields are not exist in charging Session cube',
      );
    const query = this.queryBuilder(from, to, filters);
    const s3folder = `REPORT_EXPORTER/CHARGING_SESSION`;
    const uploadPath = `${s3folder}/report_${moment().format(
      'DDMMYYYYhhmmss',
    )}.csv`;
    const download_url = this.awsS3.getSignedUrl(uploadPath, 48 * 60 * 60);
    this.generateAndUploadReport(query, uploadPath, emails)
      .then(() => {
        const emailHtml = `<h2>Hello!</h2>
        <p>Your download is ready. Click the button below to download:</p>
        <p><a href="${download_url}" target="_blank" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 30px; display: inline-block;">Download Now</a></p>
        <p>If you have any questions, feel free to contact us. Link is valid till 48 hours</p>
        <p>Best regards,<br>Blink Charging<br>Charge on</p>`;
        const subject = `Report is Ready to download!`;
        return this.emailService.sendEmailText(emails, subject, emailHtml);
      })
      .then((res) => {
        if (res === 'success') this.logger.log(`Email sent successfully`);
        else this.logger.log('Email sending failed');
      })
      .catch((err) => this.logger.error(err.message));
    return {
      msg: 'SUCCESS',
      description:
        'We are processing your request!! You will get email once report is genrated. Download link will be active for 48 hours',
    };
  }
}
