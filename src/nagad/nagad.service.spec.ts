import { Test, TestingModule } from '@nestjs/testing';
import { NagadService } from './nagad.service';

describe('NagadService', () => {
  let service: NagadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NagadService],
    }).compile();

    service = module.get<NagadService>(NagadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
