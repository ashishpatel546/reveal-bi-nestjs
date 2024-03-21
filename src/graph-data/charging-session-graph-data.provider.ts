import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  Logger,
  ParseBoolPipe,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  Daywise,
  GraphDataRequestDto,
  MonthWise,
  QuarterWise,
  YearWise,
} from './dto/graph-data-request.dto';
import { Reports } from './enum/report-enum';
import { FetchingCriteria } from './enum/fetching-criteria-enums';
import { dateValidation } from 'src/utilities/dateMethods';
import moment from 'moment';
import { idArrayToString } from 'src/utilities/sharedMethods';
import { Filter } from './dto/filter.dto';

@Injectable()
export class ChargingSessionGraphDataProiver {
  private logger = new Logger(ChargingSessionGraphDataProiver.name);
  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
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

  private async getDayWiseHostRevenue(dayWiseReq: Daywise, filters: Filter[]) {
    const { from, to } = dayWiseReq;
    const [fromDate, toDate] = dateValidation(from, to);
    const fromString = moment(fromDate).format('YYYY-MM-DD');
    const toString = moment(toDate).format('YYYY-MM-DD');
    let query = `SELECT
    post_date::date AS day,
    SUM(total_fee) AS total_fee
    FROM
    charging_session
    WHERE
    post_date::date BETWEEN '${fromString}' AND '${toString}'`;
    query = this.addFiltersToQuery(query, filters);
    const subQuery = ` GROUP BY
    post_date::date
    ORDER BY
    day;`;
    query += subQuery;
    try {
      return this.redshift.query(query);
    } catch (error) {
      this.logger.error('Unable to get data from day wise section');
      this.logger.error(error.message);
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  private async getMonthWiseHostRevenue(
    monthWiseReq: MonthWise,
    filters: Filter[],
  ) {
    const { year } = monthWiseReq;
    const isValidYear = moment(year).isValid();
    if (!isValidYear)
      throw new BadRequestException(
        `Give year is not a valid year for month wise report`,
      );
    let query = `SELECT
    TO_CHAR(post_date, 'MM') AS month,
    SUM(total_fee) AS total_fee
    FROM
    charging_session
    WHERE
    TO_CHAR(post_date, 'YYYY') = '${year}'`;
    query = this.addFiltersToQuery(query, filters);
    const subQuery = `GROUP BY
    TO_CHAR(post_date, 'MM')
    ORDER BY
    month;`;
    query += subQuery;
    try {
      return this.redshift.query(query);
    } catch (error) {
      this.logger.error('Unable to get data from year wise section');
      this.logger.error(error.message);
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  private async getYearWiseHostRevenue(yearWiseReq: YearWise, filters:Filter[]) {
    const { from_year, to_year } = yearWiseReq;
    const isValidFromYear = moment(from_year).isValid();
    const isValidToYear = moment(to_year).isValid();
    if (!isValidFromYear || !isValidToYear)
      throw new BadRequestException(
        `Give from_year or to_year is not a valid year for year wise report`,
      );
    let query = `SELECT
    TO_CHAR(post_date, 'YYYY') AS year,
    SUM(total_fee) AS total_fee
    FROM
    charging_session
    WHERE
    TO_CHAR(post_date, 'YYYY') BETWEEN '${from_year}' AND '${to_year}'`  
    query = this.addFiltersToQuery(query, filters)
    const subquery = ` GROUP BY
    TO_CHAR(post_date, 'YYYY')
    ORDER BY
    year;`;
    query += subquery
    try {
      return this.redshift.query(query);
    } catch (error) {
      this.logger.error('Unable to get data from year wise section');
      this.logger.error(error.message);
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  private async getQuarterWiseHostRevenue(
    quarterWiseReq: QuarterWise,
    filters: Filter[],
  ) {
    const { year } = quarterWiseReq;
    const isValidYear = moment(year).isValid();
    if (!isValidYear)
      throw new BadRequestException(
        `Give year is not a valid year for quarter wise report`,
      );
    let query = `SELECT TO_CHAR(post_date, 'YYYY') AS year,
    CONCAT('Q', DATE_PART('quarter', post_date)) AS quarter,
    SUM(total_fee) AS total_fee
    FROM
    charging_session
    WHERE
    TO_CHAR(post_date, 'YYYY') = '${year}' `;
    query = this.addFiltersToQuery(query, filters);
    const subQuery = `GROUP BY
    TO_CHAR(post_date, 'YYYY'),
    DATE_PART('quarter', post_date)
    ORDER BY
    year,
    quarter;`;
    query += subQuery;
    console.log(query);
    try {
      return this.redshift.query(query);
    } catch (error) {
      this.logger.error('Unable to get data from quarter wise section');
      this.logger.error(error.message);
      throw new InternalServerErrorException('Something went wrong!!!');
    }
  }

  async getHostRevenue(
    criteria: FetchingCriteria,
    dayWise?: Daywise,
    quarterWise?: QuarterWise,
    yearWise?: YearWise,
    monthWise?: MonthWise,
    filters?: Filter[],
  ) {
    if (
      criteria === FetchingCriteria.DAY_WISE &&
      Boolean(yearWise.isYearWise)
    ) {
      return this.getDayWiseHostRevenue(dayWise, filters);
    } else if (
      criteria === FetchingCriteria.QUARTER_WISE &&
      Boolean(quarterWise.isQaurterWise)
    ) {
      return this.getQuarterWiseHostRevenue(quarterWise, filters);
    } else if (
      criteria === FetchingCriteria.YEAR_WISE &&
      Boolean(yearWise.isYearWise)
    ) {
      return this.getYearWiseHostRevenue(yearWise, filters);
    } else if (
      criteria === FetchingCriteria.MONTH_WISE &&
      Boolean(monthWise.isMonthWise)
    ) {
      return this.getMonthWiseHostRevenue(monthWise, filters);
    } else {
      throw new BadRequestException(
        'Fetching criteria does not belongs to valid fetching criteria with corresponding parameters',
      );
    }
  }
}
