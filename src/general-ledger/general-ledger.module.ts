import { Module } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { GeneralLedgerController } from './general-ledger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralLedger } from './entities/general-ledger.entity';

@Module({
  imports:[TypeOrmModule.forFeature([GeneralLedger])],
  controllers: [GeneralLedgerController],
  providers: [GeneralLedgerService]
})
export class GeneralLedgerModule {}
