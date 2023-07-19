import { Module } from '@nestjs/common';
import { AmarpayService } from './amarpay.service';
import { AmarpayController } from './amarpay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports:[TypeOrmModule.forFeature([])],
  controllers: [AmarpayController],
  providers: [AmarpayService]
})
export class AmarpayModule {}
