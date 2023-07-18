import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { NagadService } from './nagad.service';
import { NagadController } from './nagad.controller';

@Module({
  imports:[TypeOrmModule.forFeature([])],
  controllers: [NagadController],
  providers: [NagadService]
})
export class NagadModule {}
