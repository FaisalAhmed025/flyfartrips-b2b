
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { DepositrequestService } from './depositrequest.service';
import { CreateDepositrequestDto } from './dto/create-depositrequest.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { GCSStorageService } from 'src/s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Bankdeposit, PaymentStatus } from './entities/bankdeposit.entity';
import { Agent } from 'src/agent/entities/agent.entity';
import { agentService } from 'src/agent/agent.service';
import { GeneralLedger } from 'src/general-ledger/entities/general-ledger.entity';

@ApiTags('Bankdeposit Module')
@Controller('depositrequest')
export class DepositrequestController {
  constructor(
    @InjectRepository(Agent) private agentrepository: Repository<Agent>,
    @InjectRepository(Bankdeposit) private bankdepositrepository: Repository<Bankdeposit>,
    @InjectRepository(GeneralLedger) private GeneralLedgerpository: Repository<GeneralLedger>,
    private readonly depositrequestService: DepositrequestService,
    private s3service: GCSStorageService,
    private readonly agentService: agentService
    ) {}
    
  generateCustomTransactionId(): string {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substr(2, 6); // Generate a random alphanumeric string
    const hash = createHash('sha256').update(`AP${timestamp}${randomString}`).digest('hex');
    const shortenedHash = hash.substr(0, 16).toUpperCase();
    return shortenedHash;
  }
  
  @ApiBearerAuth()
  @Post('amarpay/payment')
  async postPayment(@Req() req: Request, @Res() res: Response) {
    const jwttoken = req.headers['authorization'];
    const decodedtoken = await this.agentService.verifyToken(jwttoken)
    const agentid =decodedtoken.agentid
    const agent = await this.agentrepository.findOne({where:{agentid}})
    if(!agent){
      throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
    }

    const {
      cus_name,
      cus_email,
      cus_phone,
      amount,
      desc,
      currency,
      cus_add1,
      cus_add2,
      cus_city,
      cus_country,
      tran_id,
      paymentgatway,
    } = req.body;
    const transactionId = tran_id || this.generateCustomTransactionId();
    const requestBody = {
      cus_name: cus_name || '',
      cus_email: cus_email || '',
      cus_phone: cus_phone || '',
      amount: amount || 100,
      tran_id: transactionId,
      signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
      store_id: 'aamarpaytest',
      currency: currency || 'BDT',
      desc: desc || '',
      cus_add1: cus_add1 || '53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh',
      cus_add2: cus_add2 || 'Dhaka',
      cus_city: cus_city || 'Dhaka',
      paymentgatway: paymentgatway || '',
      cus_country: cus_country || 'Bangladesh',
      success_url: `http://localhost:5000/depositrequest/amarpay/callback/${transactionId}`,
      fail_url: 'http://localhost:5000/fail',
      cancel_url: 'http://localhost:5000/cancel',
      type: 'json',
    };

    const deposit = new Bankdeposit()
    deposit.status  = PaymentStatus.PENDING
    deposit.amount =amount;
    deposit.transactionid = transactionId 
    deposit.agentid =agent.agentid
    deposit.paymentgateway =paymentgatway
    await this.bankdepositrepository.save(deposit)


  const url ='https://sandbox.aamarpay.com/jsonpost.php'
    try {
      const { data } = await axios.post(url,requestBody);
      if (data.result !== 'true') {
        let errorMessage = '';
        for (let key in data) {
          errorMessage += data[key] + '. ';
        }
        return res.render('error', {
          title: 'Error',
          errorMessage,
        });
      }
  
      return res.status(201).json(data.payment_url);
    } catch (error) {
      console.error(error);
      return res.render('error', {
        title: 'Error',
        errorMessage: 'An error occurred during payment processing.',
      });
    }
  }
  
  @Post('amarpay/callback/:transactionid')
 async  Confirmtransaction(
    @Param('transactionid') transactionid: string,
    @Req() req:Request, @Res() res:Response) {
    const {
      cus_name,
      pay_time,
      amount,
    } = req.body;
    const deposit =  await this.bankdepositrepository.findOne({where:{transactionid}})
    deposit.status=PaymentStatus.APPROVED
    deposit.transactiondate =pay_time
    deposit.amount=amount
    deposit .depositname =cus_name
    await  this.bankdepositrepository.save(deposit)
    await this.GeneralLedgerpository.save(deposit)
    const status = "success";
    const message = "payment successfull"
    return res.redirect(`https://www.flyfartrips.com/?message=${encodeURIComponent(message)}&status=${encodeURIComponent(status)}`)
  }
  @ApiBearerAuth()
  @Post('create')
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

    @Req() req: Request,
    @Res() res: Response,
    @Body() depositrequestdto:CreateDepositrequestDto
) {
  const jwttoken = req.headers['authorization'];
  const decodedtoken = await this.agentService.verifyToken(jwttoken)
  const agentid = decodedtoken.agentid
  const agent = await this.agentrepository.findOne({where:{agentid}})
  if(!agent){
    throw new HttpException('agent not found', HttpStatus.NOT_FOUND)
  }
  let attachment;
  if (file.attachment && file.attachment.length > 0) {
    attachment = await this.s3service.Addimage(file.attachment[0]);
    depositrequestdto.attachment =attachment;
  }
  depositrequestdto.agentid =agentid;
  await this.depositrequestService.createdepositrequest(depositrequestdto);
  return res
    .status(HttpStatus.CREATED)
    .json({ status: 'success', message: 'deposit request successful'});
}


@Patch('approve')
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
// if(deposit.status !=PaymentStatus.PENDING){
//   throw new HttpException('Deposit request already approved or rejected', HttpStatus.BAD_REQUEST)
// }
deposit.status =PaymentStatus.APPROVED
await this.bankdepositrepository.save(deposit)
await this.GeneralLedgerpository.save(deposit)
await this.agentrepository.save(agent)
await this.GeneralLedgerpository.save(agent)
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
}
