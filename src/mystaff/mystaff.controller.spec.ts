import { Test, TestingModule } from '@nestjs/testing';
import { MystaffController } from './mystaff.controller';
import { MystaffService } from './mystaff.service';

describe('MystaffController', () => {
  let controller: MystaffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MystaffController],
      providers: [MystaffService],
    }).compile();

    controller = module.get<MystaffController>(MystaffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
