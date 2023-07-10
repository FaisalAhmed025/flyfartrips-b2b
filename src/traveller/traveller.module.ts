import { Module } from '@nestjs/common';
import { TravellerService } from './traveller.service';
import { TravellerController } from './traveller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traveller } from './entities/traveller.entity';
import { S3Module } from 'src/s3/s3.module';
import { Agent } from 'src/agent/entities/agent.entity';
import { AgentModule } from 'src/agent/agent.module';
@Module({
  imports:[TypeOrmModule.forFeature([Traveller,Agent]),S3Module, AgentModule],
  controllers: [TravellerController],
  providers: [TravellerService]
})
export class TravellerModule {}
