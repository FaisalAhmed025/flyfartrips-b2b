import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpException, HttpStatus, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { agentService } from './agent.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agent.entity';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { GCSStorageService } from 'src/s3/s3.service';
import * as bcrypt from 'bcrypt';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@ApiTags('Agent Auth Module')
@Controller('agent')
export class AuthController {
  constructor(
    @InjectRepository(Agent) private agentpository: Repository<Agent>,
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
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = await this.agentService.login(email, password);
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


  @ApiBearerAuth()
  @Patch('update')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'tinFile', maxCount: 2 },
    { name: 'atabcertificationcopy', maxCount: 2 },
    { name: 'toabcertificationcopy', maxCount: 2 },
    { name: 'tradelicensecopy', maxCount: 2 }
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
        atabcertificationcopy: { type: 'string', format:'binary'},
        toabcertificationcopy: { type: 'string', format:'binary'},
        tradelicensecopy: { type: 'string', format:'binary'},
      }
    },
  })
  async updateagent(
    @UploadedFiles()
    file: {
      tinFile?: Express.Multer.File[],
      atabcertificationcopy?: Express.Multer.File[],
      toabcertificationcopy?: Express.Multer.File[],
      tradelicensecopy?: Express.Multer.File[],
    },
  @Req() req: Request,
  @Res() res: Response,
  @Body() updateagentDTO:UpdateAuthDto
) {
  const jwt_Token = req.headers['authorization'];
  const decodedtoken =  await this.agentService.verifyToken(jwt_Token)
  const agentid =decodedtoken.agentid
  const agent = await this.agentpository.findOne({where:{agentid}})
  if (!agent) {
    throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
  }
  
  let tinFile;
  if (file.tinFile && file.tinFile.length > 0) {
    tinFile = await this.s3service.Addimage(file.tinFile[0]);
    agent.tinFile =tinFile;
  }
    
  let atabcertificationcopy;
  if (file.atabcertificationcopy && file.atabcertificationcopy.length > 0) {
    atabcertificationcopy = await this.s3service.Addimage(file.atabcertificationcopy[0]);
    agent.atabcertificationcopy =atabcertificationcopy;
  }
    
  let toabcertificationcopy;
  if (file.toabcertificationcopy && file.toabcertificationcopy.length > 0) {
    toabcertificationcopy = await this.s3service.Addimage(file.toabcertificationcopy[0]);
    agent.toabcertificationcopy =toabcertificationcopy;
  }
    
  let tradelicensecopy;
  if (file.tradelicensecopy && file.tradelicensecopy.length > 0) {
    tradelicensecopy = await this.s3service.Addimage(file.tradelicensecopy[0]);
    agent.tradelicensecopy =tradelicensecopy;
  }


  if (updateagentDTO.firstName !== undefined) {
    agent.firstName = updateagentDTO.firstName;
  }
  if (updateagentDTO.lastName !== undefined) {
    agent.lastName = updateagentDTO.lastName;
  }

  if (updateagentDTO.email !== undefined) {
    agent.email = updateagentDTO.email;
  }

  if (updateagentDTO.companyName !== undefined) {
    agent.companyName = updateagentDTO.companyName;
  }

  if (updateagentDTO.companyAddress !== undefined) {
    agent.companyAddress = updateagentDTO.companyAddress;
  }

  if (updateagentDTO.password !== undefined) {
    agent.password = await bcrypt.hash(updateagentDTO.password,10)
  }
  await this.agentpository.save(agent)
  return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'agent update successful'});
}

@Get('all')
async allagent(){
  const allagent = await this.agentpository.find({order:{created_At:'DESC'}});
  return allagent;
}

@ApiBearerAuth()
@Delete('delete')
async deleteAgent(  @Req() req: Request,
@Res() res: Response,
){
  const jwt_Token = req.headers['authorization'];
  const decodedToken= await this.agentService.verifyToken(jwt_Token)
  const agentid = decodedToken.agentid;
  await this.agentpository.delete({agentid})
    return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'agent deleted successful'});
  }
}


