import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
require("dotenv").config();


@ApiTags('Auth Module')
@Controller('agent')
export class AuthController {
  constructor(
    @InjectRepository(Auth) private authrepository: Repository<Auth>,
    private readonly authService: AuthService) {}

    
    @Post('registration')
    async Register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() authdto:CreateAuthDto
  ) {
    const ExistUser = await this.authService.getUserByEmail(authdto.email);
    if (ExistUser) {
      throw new HttpException(
        'User Already Exist,please try again with another email',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.authService.Register(authdto);
    return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'agent registration successful' });
  }

}
