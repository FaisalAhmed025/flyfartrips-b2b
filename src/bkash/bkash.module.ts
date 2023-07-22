import { Module, } from '@nestjs/common';
import { BkashService } from './bkash.service';
import { BkashController } from './bkash.controller';
import { DepositrequestModule } from 'src/depositrequest/depositrequest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bankdeposit } from 'src/depositrequest/entities/bankdeposit.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[TypeOrmModule.forFeature([Bankdeposit]),
  HttpModule ,
  
  DepositrequestModule],
  controllers: [BkashController],
  providers: [BkashService]
})
export class BkashModule {}
