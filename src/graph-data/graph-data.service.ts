import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  Filter,
  GraphDistinctValueRequestDto,
} from './dto/graphDistinctValueRequest.dto';
import { idArrayToString } from 'src/utilities/sharedMethods';
import { GraphDataRequestDto } from './dto/graph-data-request.dto';
import { ChargingSessionGraphDataProiver } from './charging-session-graph-data.provider';
import { Reports } from './enum/report-enum';

@Injectable()
export class GraphDataService {
  private logger = new Logger(GraphDataService.name);
  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
    private readonly csGraphProvider: ChargingSessionGraphDataProiver,
  ) {}

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
      if (query.includes('where')) query += ` and`;
      else query += `where`;
      const fieldValueString = idArrayToString(filterValue);
      query += ` ${filterName} in (${fieldValueString})`;
    }
    return query;
  }

  private async queryBuilder(
    table_name: string,
    reqFields: string[],
    filters: Filter[],
  ) {
    const result: Record<string, string> = {};
    try {
      for (const record of reqFields) {
        const field = record;
        let query = `select distinct(${field}) from ${table_name} `;
        query = this.addFiltersToQuery(query, filters);
        const data = await this.redshift.query(query);
        result[field] = data.map((d) => d[field]);
      }
    } catch (error) {
      this.logger.error('Unable to get distinct value from redshift');
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
    return result;
  }

  async getDistinctValues(reqBody: GraphDistinctValueRequestDto) {
    const { table_name, requestedFields, filters } = reqBody;
    if (!table_name || !requestedFields?.length) {
      throw new BadRequestException(
        'Either tabl_name empty or requested fields are not present',
      );
    }
    const result = await this.queryBuilder(
      table_name,
      requestedFields,
      filters,
    );
    return result;
  }

  async getData(reqData: GraphDataRequestDto) {
    const {
      report_name,
      day_wise,
      quarter_wise,
      year_wise,
      fetching_crieteria,
      month_wise,
      filters
    } = reqData;
    switch (report_name) {
      case Reports.HOST_REVENUE:
        return this.csGraphProvider.getHostRevenue(
          fetching_crieteria,
          day_wise,
          quarter_wise,
          year_wise,
          month_wise,
          filters
        );
        break;

      default:
        throw new BadRequestException('Report name does not exist')
        break;
    }
  }
}
