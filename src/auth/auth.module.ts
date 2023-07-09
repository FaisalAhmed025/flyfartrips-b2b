
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { jwtConstants } from './constant';
import { S3Module } from 'src/s3/s3.module';
dotenv.config();


@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),S3Module,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions:{expiresIn:'1d'},
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}

