import { Controller, Get } from '@nestjs/common';
import { RevealBiService } from './reveal-bi.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reveal BI')
@Controller('reveal-bi')
export class RevealBiController {
  constructor(private readonly service: RevealBiService) {}

  @Get('/dashboards')
  async getAllDashboards() {
    return this.service.getAllDashboards();
  }
}
