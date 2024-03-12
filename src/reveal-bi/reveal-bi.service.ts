import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  Scope,
} from '@nestjs/common';
import fs from 'fs/promises';
import { join, parse } from 'path';
import { DbConfig } from 'src/shared/config/dbConfig';

@Injectable({scope: Scope.REQUEST})
export class RevealBiService {
  private logger = new Logger(RevealBiService.name);

  constructor(private readonly dbConfig: DbConfig) {}


  async getAllDashboards() {
    try {
      const dashboardPath = join(process.cwd(), '/dashboards');
      const files = await fs.readdir(dashboardPath);
      const fileNames = files.map((file) => {
        const { name } = parse(file);
        return { name };
      });
      return fileNames;
    } catch (error) {
      this.logger.error(error.message);
      this.logger.error(`Unable to read files from dashboard directories`);
      throw new InternalServerErrorException('Unable to get dashboards');
    }
  }
}
