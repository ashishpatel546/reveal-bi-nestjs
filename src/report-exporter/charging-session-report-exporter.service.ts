import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ChargingSessionFieldsDto } from './dtos/chargingSessionFields.dto';
import { parseDateToDbFormat } from 'src/utilities/dateMethods';
import { idArrayToString } from 'src/utilities/sharedMethods';
import moment from 'moment';

@Injectable()
export class ChargingSessionReportExporterService {
  private logger = new Logger(ChargingSessionReportExporterService.name);

  constructor(
    @InjectDataSource('Redshift') private readonly redshift: DataSource,
  ) {}

  async getCsvStream(table_name: string, limit: number = 500000) {
    try {
      return this.redshift
        .createQueryBuilder()
        .select()
        .from('charging_session', 'cs')
        .limit(limit)
        .stream();
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('can not fetch data from redshift');
      throw new InternalServerErrorException(
        'Something Went wrong while streaming the data',
      );
    }
  }

  async getCsvReportLink(from: Date, to: Date, filters: ChargingSessionFieldsDto) {

    const {limit} = filters
    let query = `select * from charging_session`;

    const fromString = moment(from).format('YYYY-MM-DD');
    const toString = moment(to).format('YYYY-MM-DD');
    // const fromString = parseDateToDbFormat(from);
    // const toString = parseDateToDbFormat(to);
    const appendQuery = ` where Date(post_date) between '${fromString}' and '${toString}'`;
    query +=  appendQuery
  

    for (const key of Object.keys(filters)) {

      console.log(key, 'type of--> ', typeof key )

      if (key === 'from' || key === 'to' || key === 'limit') {
        continue;
      }

      if (filters[key].length === 0) continue; 

      const keyString = idArrayToString(filters[key]);
      const appendQuery = ` and ${key} in (${keyString})`
      console.log(appendQuery);
      query +=  appendQuery

    }
    
    if(limit){
      const appendQuery = ` limit ${limit}`
    }
    console.log(query);
    return query;

  }
}
