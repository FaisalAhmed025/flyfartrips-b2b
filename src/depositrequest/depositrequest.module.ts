import { Module } from '@nestjs/common';
import { DepositrequestService } from './depositrequest.service';
import { DepositrequestController } from './depositrequest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bankdeposit } from './entities/bankdeposit.entity';
import { S3Module } from 'src/s3/s3.module';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Bankdeposit,Auth]),S3Module,AuthModule],
  controllers: [DepositrequestController],
  providers: [DepositrequestService]
})
export class DepositrequestModule {}
