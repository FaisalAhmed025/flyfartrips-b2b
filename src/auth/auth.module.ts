
import { Module } from '@nestjs/common';
import { agentService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/auth.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { jwtConstants } from './constant';
import { S3Module } from 'src/s3/s3.module';
dotenv.config();


@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),S3Module,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions:{expiresIn:'1d'},
    }),
  ],
  controllers: [AuthController],
  providers: [agentService],
  exports:[agentService]
})
export class AgentModule {}

