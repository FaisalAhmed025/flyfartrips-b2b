import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentModule } from './auth/auth.module';
import { Agent } from './auth/entities/auth.entity';
import { DepositrequestModule } from './depositrequest/depositrequest.module';
import { Bankdeposit } from './depositrequest/entities/bankdeposit.entity';
import { TravellerModule } from './traveller/traveller.module';
import { Traveller } from './traveller/entities/traveller.entity';


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
      ],
      synchronize:false,
    }),
    AgentModule,
    DepositrequestModule,
    TravellerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
