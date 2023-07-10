
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDepositrequestDto } from './dto/create-depositrequest.dto';
import { UpdateDepositrequestDto } from './dto/update-depositrequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bankdeposit } from './entities/bankdeposit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepositrequestService {
  constructor(@InjectRepository(Bankdeposit) private bankdepositrepository: Repository<Bankdeposit>){}


  async createdepositrequest(createDepositrequestDto: CreateDepositrequestDto) {
   const deposit = await this.bankdepositrepository.create(createDepositrequestDto)
   await this.bankdepositrepository.save(deposit)
  }

 async findAll() {
    return await this.bankdepositrepository.find({order:{createdAt:'DESC'}});
  }

 async findOne(depositid: string) {
    const deposited = await this.bankdepositrepository.findOne({where:{depositid}});
    if(!deposited){
      throw new HttpException('depositid not found', HttpStatus.NOT_FOUND)
    }
    return deposited;
  }

}
