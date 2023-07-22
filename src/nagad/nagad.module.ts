import { Module } from '@nestjs/common';
import { NagadService } from './nagad.service';
import { NagadController } from './nagad.controller';

@Module({
  controllers: [NagadController],
  providers: [NagadService]
})
export class NagadModule {}
