import { BadRequestException, Injectable, Logger, Post } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ChargingSessionRequestDto,
  Filters,
} from './dto/chargingSessionReq.dto';
import moment from 'moment';
import { idArrayToString } from 'src/utilities/sharedMethods';
import { ApiConfigService } from 'src/shared/config/config.service';

@Injectable()
export class ChargingSessionDataExporterService {
  private logger = new Logger(ChargingSessionDataExporterService.name);
  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
    private readonly apiConfig: ApiConfigService,
  ) {}

  private queryBuilder(
    from: Date,
    to: Date,
    filters: Filters,
    requestedFields : string[],
    page_number: number,
    page_size: number,
  ) {
    // let query = `select * from charging_session`;

    let query = 'SELECT ';

  // Check if requestedFields array exists and has elements
  if (requestedFields && requestedFields.length > 0) {
    // Extract field names from requestedFields and join them with commas
    const fieldNames = requestedFields.map(field => field).join(', ');
    query += fieldNames;
  } else {
    // If requestedFields array is empty or undefined, select all fields with *
    query += '*';
  }

  query = query + ` from charging_session `

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
    const offset = (page_number -1)*page_size
    query = query + ` order by post_date offset ${offset} limit ${page_size}`;
    this.logger.log(`[GENERIC QUERY: ] ${query}`);
    return query;
  }

  async getData(req: ChargingSessionRequestDto, from: Date, to: Date) {
    const { filters, requestedFields, page_number, page_size } = req;
    if (
      !requestedFields ||
      requestedFields.length === 0 ||
      page_size > this.apiConfig.maxPageSize ||
      page_number <= 0 ||
      !page_number ||
      !page_size ||
      page_size <=0
    ) {
      throw new BadRequestException(
        `Requested fields could not be empty and maximum page size allowed: ${this.apiConfig.maxPageSize}. page number and page size can not be <=0 or empty`,
      );
    }
    const query = this.queryBuilder(from, to, filters, requestedFields, page_number, page_size)
    this.logger.log(`[QUERY]: ${query}`)
    try {
        const data: unknown[] = await this.redshift.query(query)
        return data;
    } catch (error) {
        this.logger.error('Unable to get data from data exporter')
        this.logger.error(error.message)
        throw new BadRequestException(`Not able to get data from server. Error: ${error.message}`)
    }
  }
}
