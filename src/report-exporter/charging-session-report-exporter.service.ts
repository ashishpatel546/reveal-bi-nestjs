import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ChargingSessionFieldsDto } from './dtos/chargingSessionFields.dto';
import {
  idArrayToString,
  processStringToCleanString,
} from 'src/utilities/sharedMethods';
import moment from 'moment';
import { CsvWrapperService } from 'src/csvwrapper/csvwrapper.service';
import { AwsS3Service } from 'src/aws_service/aws_s3_service.service';
import { ApiConfigService } from 'src/shared/config/config.service';

@Injectable()
export class ChargingSessionReportExporterService {
  private logger = new Logger(ChargingSessionReportExporterService.name);
  private limit = this.apiConfig.dataFetchLimit;

  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
    private readonly csvWrapper: CsvWrapperService,
    private readonly awsS3: AwsS3Service,
    private readonly apiConfig: ApiConfigService
  ) {}


  private async mapRawTodata(dataArray: object[]) {
    const mappedData: unknown[] = [];
    if (!dataArray || dataArray.length === 0) return mappedData;
    for (const data of dataArray) {
      const record = {
        ...data,
        created_on: moment(data['created_on']).format(`YYYY-DD-MM HH:mm:ss`),
        updated_on: moment(data['updated_on']).format(`YYYY-DD-MM HH:mm:ss`),
        session_created_on: moment(data['session_created_on']).format(
          `YYYY-DD-MM HH:mm:ss`,
        ),
        session_updated_on: moment(data['session_created_on']).format(
          `YYYY-DD-MM HH:mm:ss`,
        ),
        connection_time: moment(data['connection_time']).format(
          `YYYY-DD-MM HH:mm:ss`,
        ),
        disconnect_time: moment(data['disconnect_time']).format(
          `YYYY-DD-MM HH:mm:ss`,
        ),
        charge_start: moment(data['charge_start']).format(
          `YYYY-DD-MM HH:mm:ss`,
        ),
        charge_end: moment(data['charge_end']).format(`YYYY-DD-MM HH:mm:ss`),
        post_date: moment(data['post_date']).format(`YYYY-DD-MM HH:mm:ss`),
        address_line1: processStringToCleanString(data['address_line1']),
        address_line2: processStringToCleanString(data['address_line2']),
      };
      mappedData.push(record);
    }
    return mappedData;
  }

  private async generateReportData(query: string) {
    const reportArray: unknown[] = [];
    let limit = this.limit;
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
  private emptyReportDataHandler(uploadPath: string) {
    this.logger.log(`There is no data for upload.`);
    return;
  }

  private async generateAndUploadReport(query: string, uploadPath: string) {
    const report = await this.generateReportData(query);
    if (!report || report?.length === 0) {
      this.emptyReportDataHandler(uploadPath);
      return;
    }
    this.logger.log(`No of records for the file is: ${report?.length ?? 0}`);

    this.logger.log(
      `Uploading!!! Report for to S3, path/file_name: ${uploadPath}`,
    );
    
    //handle small files as multipart has limit of min 5mb file
    if(report?.length < 10000){
      this.logger.log('Handling small files for approx size less than 5mb')
      const csv = this.csvWrapper.jsonToCsvBuffer(report)
      await this.awsS3.uploadfileInCsv(uploadPath, csv);
    }else{
      this.logger.log('Handling small files for approx size greater than 5mb')
      await this.awsS3.uploadCsvToS3InChunks(uploadPath, report);
    }
    
    this.logger.log('!!!Uploading finished....');
    this.logger.log(`File is available on s3 via link provided...`);
    report.length = 0;
    return;
  }

  private queryBuilder(
    from: Date,
    to: Date,
    filters: ChargingSessionFieldsDto,
  ) {
    let query = `select * from charging_session`;

    const fromString = moment(from).format('YYYY-MM-DD');
    const toString = moment(to).format('YYYY-MM-DD');
    const appendQuery = ` where Date(post_date) between '${fromString}' and '${toString}'`;
    query += appendQuery;

    for (const key of Object.keys(filters)) {
      if (key === 'from' || key === 'to' || key === 'limit') {
        continue;
      }

      if (filters[key]?.length === 0) continue;

      const keyString = idArrayToString(filters[key]);
      const appendQuery = ` and ${key} in (${keyString})`;
      query += appendQuery;
    }
    query = query + ` order by post_date `;
    this.logger.log(`[GENERIC QUERY: ] ${query}`);
    return query;
  }

  async getCsvReportLink(
    from: Date,
    to: Date,
    filters: ChargingSessionFieldsDto,
  ) {
    const query = this.queryBuilder(from, to, filters);
    const s3folder = `REPORT_EXPORTER/CHARGING_SESSION`;
    const uploadPath = `${s3folder}/report_${moment().format(
      'DDMMYYYYhhmmss',
    )}.csv`;
    const download_url = this.awsS3.getSignedUrl(uploadPath, 3600 * 3);
    this.generateAndUploadReport(query, uploadPath);
    return {
      message: `You have requested report that is quite large and we have generated the link, please click on that link to download the report. Report will be available soon on that link and link is valid for 180 minutes from now.`,
      status_codes: {
        200: 'Report is Available',
        404: 'Report is being generated, Please Wait',
        403: 'Report expired',
      },
      url: download_url,
    };
  }
}
