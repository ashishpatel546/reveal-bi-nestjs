import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ThrottlerService } from './throttler.service';
import { ResponseStatus, StatusOptions } from 'src/glolbal-interfaces/status';

@ApiTags('Throttler')
@Controller('throttler')
export class ThrottlerController {
  constructor(private readonly service: ThrottlerService) {}

  @ApiQuery({
    name: 'ip',
    description:
      'Enter the public IP of the system to which you want to allow the download',
  })
  @Get()
  deleteCachForIp(@Query('ip') ip: string) {
    this.service.deleteEntry(ip);
    return {
        msg: StatusOptions.SUCCESS,
        description: 'Request processed Successfully',
      };
  }

  @Get('/clean-all')
  cleanThrottlerCache(): ResponseStatus<never> {
    this.service.deleteOldIpEntry(true);
    return {
      msg: StatusOptions.SUCCESS,
      description: 'Request processed Successfully',
    };
  }
}
