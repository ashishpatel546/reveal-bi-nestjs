import { Request, Response } from 'express';
import { join } from 'path';
import reveal, {
  IRVUserContext,
  RVDashboardDataSource,
  RVDataSourceItem,
  RVRedshiftDataSource,
  RVUserContext,
  RVUsernamePasswordDataSourceCredential,
  RevealOptions,
} from 'reveal-sdk-node';
import fs from 'fs';
import { Logger } from '@nestjs/common';
import { DbConfig } from 'src/shared/config/dbConfig';
import { ConfigService } from '@nestjs/config';

export function RevealBiMiddleware(
  req: Request,
  res: Response,
  // _next: NextFunction,
) {
  const logger = new Logger('Reveal-BI-Middleware');
  logger.log('Reveal middleware called');

  const configService = new ConfigService();
  const dbConfig = new DbConfig(configService);

  const authenticationProvider = async (
    _userContext: IRVUserContext,
    dataSource: RVDashboardDataSource,
  ) => {
    logger.log('hting authentication provider');
    const userName = dbConfig.redshiftUserName;
    const password = dbConfig.redshiftPassword;
    if (dataSource instanceof RVRedshiftDataSource)
      return new RVUsernamePasswordDataSourceCredential(userName, password);

    return null;
  };

  const dataSourceProvider = async (
    _userContext: IRVUserContext,
    dataSource: RVDashboardDataSource,
  ) => {
    logger.log('hitting datasource provider');
    if (dataSource instanceof RVRedshiftDataSource) {
      dataSource.host = dbConfig.redshiftHost;
      dataSource.port = dbConfig.redshiftPort;
      dataSource.database = dbConfig.redshiftDefaultDatabase;
    }
    return dataSource;
  };

  const dataSourceItemProvider = async (
    userContext: IRVUserContext,
    dataSourceItem: RVDataSourceItem,
  ) => {
    logger.log('hitting datasource item provider');
    //update underlying data source
    dataSourceProvider(userContext, dataSourceItem.dataSource);

    //only change the table if we have selected our data source item
    if (dataSourceItem.id === 'Charging Session') {
      dataSourceItem['table'] = 'charging_session';
    } else if (dataSourceItem.id === 'Charging Session Custom Query') {
      logger.log(dataSourceItem.dataSource);
      dataSourceItem[
        'customQuery'
      ] = `select * from charging_session where country_code = 'US'`;
    }

    return dataSourceItem;
  };

  function getLicenceKey() {
    try {
      const filePath = join(process.cwd(), 'licence.key');
      const licence = fs.readFileSync(filePath, 'utf-8');
      return licence;
    } catch (error) {
      logger.error(error.message);
      logger.error('unable to get licence key!!!');
      return null;
    }
  }

  function userContextProvider(req: Request) {
    logger.log('calling user context provider');
    const props: Map<string, string | string[]> = new Map();
    const countries = req.headers.countries;
    const user_id = req.headers.user_id as string;
    props.set('countries', countries);
    props.set('user_id', user_id);
    const userContext = new RVUserContext(user_id, props);
    return userContext;
  }

  // const dashboardProvider = (
  //   userContext: IRVUserContext,
  //   dashboardId: string,
  // ) => {};

  // const dashboardStorageProvider = (
  //   userContext: IRVUserContext | null,
  //   dashboardId: string,
  //   stream: ReadStream,
  // ) => {};

  const revealOptions: RevealOptions = {
    authenticationProvider: authenticationProvider,
    dataSourceProvider: dataSourceProvider,
    dataSourceItemProvider: dataSourceItemProvider,
    license: getLicenceKey(),
    userContextProvider: () => userContextProvider(req),
  };

  reveal(revealOptions)(req, res);
}
