import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { DepositrequestService } from './depositrequest.service';
import { CreateDepositrequestDto } from './dto/create-depositrequest.dto';
import { UpdateDepositrequestDto } from './dto/update-depositrequest.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { GCSStorageService } from 'src/s3/s3.service';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Bankdeposit, PaymentStatus } from './entities/bankdeposit.entity';

@ApiTags('Bankdeposit Module')
@Controller('depositrequest')
export class DepositrequestController {
  constructor(
    @InjectRepository(Auth) private agentrepository: Repository<Auth>,
    @InjectRepository(Bankdeposit) private bankdepositrepository: Repository<Bankdeposit>,
    private readonly depositrequestService: DepositrequestService,
    private s3service: GCSStorageService,
    private readonly authService: AuthService,
    ) {}

  @ApiBearerAuth()
  @Post('create/:agentid')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'attachment', maxCount: 2 }
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        depositmethod: { type: 'string' },
        sender: { type: 'string' },
        reciever: { type: 'string',},
        bankname: { type: 'string' },
        paymentgateway: { type: 'string' },
        transactionid: { type: 'string' },
        depositname: { type: 'string'},
        chequenumber: { type: 'string'},
        depositby: { type: 'string'},
        actionby: { type: 'string'},
        rejectionreason: { type: 'string'},
        chequeissuedate: { type: 'string'},
        transfertype:{type:'string'},
        transactiondate:{type:'date'},
        amount:{type:'number'},
        attachment: { type: 'string', format:'binary'},
      }
    },
  })
  async RequestDeposit(
    @UploadedFiles()
    file: {
      attachment?: Express.Multer.File[]
    },
    @Param('agentid') agentid:string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() depositrequestdto:CreateDepositrequestDto
) {
  const jwttoken = req.headers['authorization'];
 await this.authService.verifyToken(jwttoken)
  const agent = await this.agentrepository.findOne({where:{agentid}})
  if(!agent){
    throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
  }
  let attachment;
  if (file.attachment && file.attachment.length > 0) {
    attachment = await this.s3service.Addimage(file.attachment[0]);
    depositrequestdto.attachment =attachment;
    depositrequestdto.agentid =agentid;
  }
  await this.depositrequestService.createdepositrequest(depositrequestdto);
  return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'deposit request successful'});
}


@Patch('approve/:agentid')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      actionby: { type: 'string' },
      agentid: { type: 'string' },
    },
  },
})
async ApprovedDeposit(
  @Param('depositid') depositid: string,
  @Body('agentid') agentid:string,
  @Req() req: Request,
  @Res() res: Response,
) {
  const agent = await this.agentrepository.findOne({where:{agentid}})
  if(!agent){
    throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
  }
  const deposit = await this.bankdepositrepository.findOne({where:{depositid}})
  if(!deposit){
    throw new HttpException('deposit not found', HttpStatus.NOT_FOUND)
  }
if(deposit.status !=PaymentStatus.PENDING){
  throw new HttpException('Deposit request already approved or rejected', HttpStatus.BAD_REQUEST)
}
deposit.status =PaymentStatus.APPROVED
await this.bankdepositrepository.save(deposit)
agent.walletbalance =deposit.amount
await this.agentrepository.save(agent)
return res
  .status(HttpStatus.CREATED)
  .json({ status: 'success', message: 'amount approved'});
}


@Patch('reject/:agentid')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      actionby: { type: 'string' },
      rejectionreason: { type: 'string' },
    },
  },
})

async RejectDeposit(
  @Param('depositid') depositid: string,
  @Body('agentid') agentid:string,
  @Req() req: Request,
  @Res() res: Response,
) {

const deposit = await this.bankdepositrepository.findOne({where:{depositid}})
if(!deposit){
  throw new HttpException('deposit not found', HttpStatus.NOT_FOUND)
}

const agent = await this.agentrepository.findOne({where:{agentid}})
if(!agent){
  throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
}

deposit.status =PaymentStatus.REJECTED
await this.bankdepositrepository.save(deposit)
return res
  .status(HttpStatus.CREATED)
  .json({ status: 'success', message: 'amount rejected'});
}

  @Get('all')
  findAll() {
    return this.depositrequestService.findAll();
  }

  @Get(':depositid')
  findOne(@Param('depositid') depositid: string) {
    return this.depositrequestService.findOne(depositid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositrequestDto: UpdateDepositrequestDto) {
    return this.depositrequestService.update(+id, updateDepositrequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositrequestService.remove(+id);
  }
}
