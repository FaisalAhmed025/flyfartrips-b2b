import { Module } from '@nestjs/common';
import { DepositrequestService } from './depositrequest.service';
import { DepositrequestController } from './depositrequest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bankdeposit } from './entities/bankdeposit.entity';
import { S3Module } from 'src/s3/s3.module';
import { Agent } from 'src/agent/entities/agent.entity';
import { AgentModule } from 'src/agent/agent.module';
import { GeneralLedger } from 'src/general-ledger/entities/general-ledger.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Bankdeposit,Agent,GeneralLedger]),S3Module,AgentModule],
  controllers: [DepositrequestController],
  providers: [DepositrequestService]
})
export class DepositrequestModule {}
