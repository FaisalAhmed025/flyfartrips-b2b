import { Module } from '@nestjs/common';
import { TravellerService } from './traveller.service';
import { TravellerController } from './traveller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traveller } from './entities/traveller.entity';
import { S3Module } from 'src/s3/s3.module';
import { Agent } from 'src/auth/entities/auth.entity';
import { AgentModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Traveller,Agent]),S3Module, AgentModule],
  controllers: [TravellerController],
  providers: [TravellerService]
})
export class TravellerModule {}
