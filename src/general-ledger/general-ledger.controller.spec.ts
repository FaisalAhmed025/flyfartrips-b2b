import { Test, TestingModule } from '@nestjs/testing';
import { GeneralLedgerController } from './general-ledger.controller';
import { GeneralLedgerService } from './general-ledger.service';

describe('GeneralLedgerController', () => {
  let controller: GeneralLedgerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralLedgerController],
      providers: [GeneralLedgerService],
    }).compile();

    controller = module.get<GeneralLedgerController>(GeneralLedgerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
