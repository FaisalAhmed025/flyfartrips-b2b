
import 'dotenv/config'
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([Auth]),
  JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions:{expiresIn:'1d'},
 })]
,
  controllers: [AuthController],
  providers: [AuthService,JwtService]
})
export class AuthModule {}
