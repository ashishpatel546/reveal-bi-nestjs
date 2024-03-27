import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Between, DataSource } from 'typeorm';
import { ChargingSessionRequestDto } from './dto/chargingSessionReq.dto';
import moment from 'moment';
import {
  checkArrayElementsMatch,
  idArrayToString,
} from 'src/utilities/sharedMethods';
import { ApiConfigService } from 'src/shared/config/config.service';
import { ChargingSession } from 'src/entities/redshift/charging-session.entity';
import {
  getDayEndTimeStamp,
  getDayStartTimeStamp,
} from 'src/utilities/dateMethods';
import { ResponseStatus, StatusOptions } from 'src/glolbal-interfaces/status';
import { ChargingSessionDataResponse } from './interface/dataResponse.dto';
import { Filter } from './dto/filter.dto';

@Injectable()
export class ChargingSessionDataExporterService {
  private logger = new Logger(ChargingSessionDataExporterService.name);
  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
    private readonly apiConfig: ApiConfigService,
  ) {}

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
    filters: Filter[],
    requestedFields: string[],
    page_number: number,
    page_size: number,
  ) {
    // let query = `select * from charging_session`;

    const classElements = this.redshift
      .getMetadata(ChargingSession)
      .ownColumns.map((column) => column.propertyName);
    const { isMatched, unmatchedFields } = checkArrayElementsMatch(
      requestedFields,
      classElements,
    );
    if (!isMatched)
      throw new BadRequestException({
        'Unmatched Fields': unmatchedFields,
        description:
          'All requested fields are not exist in charging Session cube',
      });

    const filterKeys = filters.map((f) => f.fieldName.trim());
    const {
      isMatched: isFIlterKeysMatched,
      unmatchedFields: filterUnmatchedFields,
    } = checkArrayElementsMatch(filterKeys, classElements);

    if (!isFIlterKeysMatched) {
      throw new BadRequestException({
        'Unmatched Fields': filterUnmatchedFields,
        description:
          'All requested fields are not exist in charging Session cube',
      });
    }

    let query = this.buildQuerywithRequestedFields(
      requestedFields,
      'charging_session',
    );

    //add dates for which data required
    const fromString = moment(from).format('YYYY-MM-DD');
    const toString = moment(to).format('YYYY-MM-DD');
    const appendQuery = ` where Date(post_date) between '${fromString}' and '${toString}'`;
    query += appendQuery;

    const offset = (page_number - 1) * page_size;
    query = query + ` order by post_date offset ${offset} limit ${page_size}`;
    this.logger.log(`[GENERIC QUERY: ] ${query}`);

    return query;

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

    // const fromString = moment(from).format('YYYY-MM-DD');
    // const toString = moment(to).format('YYYY-MM-DD');
    // const appendQuery = ` where Date(post_date) between '${fromString}' and '${toString}'`;
    // query += appendQuery;

    // for (const key of Object.keys(filters)) {
    //   // if (key === 'from' || key === 'to' || key === 'limit') {
    //   //   continue;
    //   // }

    //   if (filters[key]?.length === 0) continue;

    //   const keyString = idArrayToString(filters[key]);
    //   const appendQuery = ` and ${key} in (${keyString})`;
    //   query += appendQuery;
    // }
    // const offset = (page_number - 1) * page_size;
    // query = query + ` order by post_date offset ${offset} limit ${page_size}`;
    // this.logger.log(`[GENERIC QUERY: ] ${query}`);
  }

  private async getTotalCountOfRecord(from: Date, to: Date) {
    const toTimeStamp = getDayEndTimeStamp(to);
    const fromTimeStamp = getDayStartTimeStamp(from);
    try {
      // const fromString = moment(from).format(`YYYY-MM-DD`);
      // const toString = moment(to).format(`YYYY-MM-DD`);
      // const query = `select count(*) from charging_session where Date(post_date) between '${fromString}' and '${toString}'`;
      const count = await this.redshift
        .getRepository(ChargingSession)
        .createQueryBuilder('cs')
        .where({
          post_date: Between(fromTimeStamp, toTimeStamp),
        })
        .getCount();
      return count;
    } catch (error) {
      this.logger.error('Unable to get count of records');
      this.logger.error(error.message);
      return null;
    }
  }

  async getData(
    req: ChargingSessionRequestDto,
    from: Date,
    to: Date,
  ): Promise<ResponseStatus<ChargingSessionDataResponse>> {
    const { filters, requestedFields, page_number, page_size } = req;
    if (
      !requestedFields ||
      requestedFields.length === 0 ||
      page_size > this.apiConfig.maxPageSize ||
      page_number <= 0 ||
      !page_number ||
      !page_size ||
      page_size <= 0
    ) {
      throw new BadRequestException(
        `Requested fields could not be empty and maximum page size allowed: ${this.apiConfig.maxPageSize}. page number and page size can not be <=0 or empty`,
      );
    }
    const query = this.queryBuilder(
      from,
      to,
      filters,
      requestedFields,
      page_number,
      page_size,
    );
    this.logger.log(`[QUERY]: ${query}`);
    try {
      const data: ChargingSession[] = await this.redshift.query(query);
      const totalCount = await this.getTotalCountOfRecord(from, to);
      return {
        msg: StatusOptions.SUCCESS,
        description: 'Request Processed',
        data: {
          total_records: totalCount ?? 0,
          page_number,
          current_page_size: data?.length ?? 0,
          records: data,
        },
      };
    } catch (error) {
      this.logger.error('Unable to get data from data exporter');
      this.logger.error(error.message);
      throw new BadRequestException(
        `Not able to get data from server. Error: ${error.message}`,
      );
    }
  }

  getAllColuns() {
    try {
      const columns = this.redshift
        .getMetadata(ChargingSession)
        .ownColumns.map((column) => column.propertyName);
      return columns;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to fetch columns list');
      throw new InternalServerErrorException(error.message);
    }
  }
}
