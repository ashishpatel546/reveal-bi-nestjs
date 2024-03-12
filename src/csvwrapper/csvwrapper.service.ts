import { Injectable, Logger } from '@nestjs/common';
import { Parser } from 'json2csv';
@Injectable()
export class CsvWrapperService {
  private readonly logger = new Logger(CsvWrapperService.name);

  convertJsonToCsv(json: unknown) {
    const parser = new Parser();
    try {
      const csvContent = parser.parse(json);
      return csvContent;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to convert json to csv');
    }
  }

  jsonToCsvBuffer(json: unknown) {
    try {
      const csv = this.convertJsonToCsv(json);
      const csvBuffer = Buffer.from(csv);
      return csvBuffer;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error('Unable to convert json to csv buffer');
    }
  }
}
