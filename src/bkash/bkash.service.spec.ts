import { Test, TestingModule } from '@nestjs/testing';
import { BkashService } from './bkash.service';

describe('BkashService', () => {
  let service: BkashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BkashService],
    }).compile();

    service = module.get<BkashService>(BkashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
