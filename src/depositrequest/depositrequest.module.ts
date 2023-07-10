import { Module } from '@nestjs/common';
import { DepositrequestService } from './depositrequest.service';
import { DepositrequestController } from './depositrequest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bankdeposit } from './entities/bankdeposit.entity';
import { S3Module } from 'src/s3/s3.module';
import { Agent } from 'src/auth/entities/auth.entity';
import { AgentModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Bankdeposit,Agent]),S3Module,AgentModule],
  controllers: [DepositrequestController],
  providers: [DepositrequestService]
})
export class DepositrequestModule {}
