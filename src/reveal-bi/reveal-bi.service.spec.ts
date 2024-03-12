import { Test, TestingModule } from '@nestjs/testing';
import { RevealBiService } from './reveal-bi.service';

describe('RevealBiService', () => {
  let service: RevealBiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevealBiService],
    }).compile();

    service = module.get<RevealBiService>(RevealBiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
