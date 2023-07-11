import { Module } from '@nestjs/common';
import { MystaffService } from './mystaff.service';
import { MystaffController } from './mystaff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/mystaff.entity';
import { Agent } from 'src/agent/entities/agent.entity';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports:[TypeOrmModule.forFeature([Staff,Agent]), AgentModule],
  controllers: [MystaffController],
  providers: [MystaffService]
})
export class MystaffModule {}
