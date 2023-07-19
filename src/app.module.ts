import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DepositrequestModule } from './depositrequest/depositrequest.module';
import { Bankdeposit } from './depositrequest/entities/bankdeposit.entity';
import { TravellerModule } from './traveller/traveller.module';
import { Traveller } from './traveller/entities/traveller.entity';
import { AgentModule } from './agent/agent.module';
import { Agent } from './agent/entities/agent.entity';
import { MystaffModule } from './mystaff/mystaff.module';
import { Staff } from './mystaff/entities/mystaff.entity';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { GeneralLedger } from './general-ledger/entities/general-ledger.entity';
import { NagadModule } from './nagad/nagad.module';
import { AmarpayModule } from './amarpay/amarpay.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal:true, envFilePath: '.env', }),
    TypeOrmModule.forRoot({
      type:'mysql',
      // username:"flyfarin_fflv2",
      // password: "123Next2$",
      // host: "flyfarint.com",
      // database:"flyfarin_fflv2",

      username:'root',
      password:'',
      host: '127.0.0.1',
      database:'flyfartrips_b2b',
      port:3306,
      entities:[
        Agent,
        Bankdeposit,
        Traveller,
        Staff,
        GeneralLedger
      ],
      synchronize:true,
    }),
    AgentModule,
    DepositrequestModule,
    TravellerModule,
    MystaffModule,
    GeneralLedgerModule,
    NagadModule,
    AmarpayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
