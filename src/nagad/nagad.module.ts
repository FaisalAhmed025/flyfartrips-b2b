

import { NagadService } from './nagad.service';
// import { NagadController } from './nagad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
    }),
  ],
  controllers: [],
  providers: [NagadService],
 
})
export class NagadModule {}
