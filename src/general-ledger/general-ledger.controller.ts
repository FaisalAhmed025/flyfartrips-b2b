import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { CreateGeneralLedgerDto } from './dto/create-general-ledger.dto';
import { UpdateGeneralLedgerDto } from './dto/update-general-ledger.dto';


@Controller('general-ledger')
export class GeneralLedgerController {
  constructor(private readonly generalLedgerService: GeneralLedgerService) {}
}
