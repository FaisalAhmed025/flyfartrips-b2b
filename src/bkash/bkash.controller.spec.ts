import { Test, TestingModule } from '@nestjs/testing';
import { BkashController } from './bkash.controller';
import { BkashService } from './bkash.service';

describe('BkashController', () => {
  let controller: BkashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BkashController],
      providers: [BkashService],
    }).compile();

    controller = module.get<BkashController>(BkashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
