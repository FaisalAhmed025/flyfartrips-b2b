import { Test, TestingModule } from '@nestjs/testing';
import { MystaffService } from './mystaff.service';

describe('MystaffService', () => {
  let service: MystaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MystaffService],
    }).compile();

    service = module.get<MystaffService>(MystaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
