import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpException, HttpStatus, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { agentService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { GCSStorageService } from 'src/s3/s3.service';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@ApiTags('Agent Auth Module')
@Controller('agent')
export class AuthController {
  constructor(
    @InjectRepository(Agent) private authrepository: Repository<Agent>,
    private readonly agentService: agentService,
    private s3service: GCSStorageService,
    ) {}

    @Post('registration')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'tinFile', maxCount: 2 }
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          companyName: { type: 'string',},
          companyAddress: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          tinFile: { type: 'string', format:'binary'},
        }
      },
    })
    async Register(
      @UploadedFiles()
      file: {
        tinFile?: Express.Multer.File[]
      },
    @Req() req: Request,
    @Res() res: Response,
    @Body() authdto:CreateAuthDto
  ) {
    const ExistUser = await this.agentService.getUserByEmail(authdto.email);
    if (ExistUser) {
      throw new HttpException(
        'User Already Exist,please try again with another email',
        HttpStatus.BAD_REQUEST,
      );
    }
    let tinFile;
    if (file.tinFile && file.tinFile.length > 0) {
      tinFile = await this.s3service.Addimage(file.tinFile[0]);
      authdto.tinFile =tinFile;
    }
    await this.agentService.Register(authdto);
    return res
      .status(HttpStatus.CREATED)
      .json({ status: 'success', message: 'agent registration successful'});
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  
  async login(
    @Body('email') Email: string,
    @Body('password') Password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = await this.agentService.login(Email, Password);
    return res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'login successfull',
      access_token: token
    });
  }

  @ApiBearerAuth()
  @Post('verify')
  async verify(@Req() req: Request){
    const jwt_Token = req.headers['authorization'];
    return await this.agentService.verifyToken(jwt_Token)
  }




}


