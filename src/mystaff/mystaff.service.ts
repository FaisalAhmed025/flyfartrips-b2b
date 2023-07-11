import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateMystaffDto } from './dto/create-mystaff.dto';
import { UpdateMystaffDto } from './dto/update-mystaff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/mystaff.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateTravellerDto } from 'src/traveller/dto/create-traveller.dto';

@Injectable()
export class MystaffService {
  constructor(@InjectRepository(Staff) private staffRepository:Repository<Staff>){}
  
  async Addstaff(createMystaffDto: CreateMystaffDto) {
    const hashpawwsord = await bcrypt.hash(createMystaffDto.password,10)
    const staff = await this.staffRepository.create({...createMystaffDto,password:hashpawwsord})
    await this.staffRepository.save(staff)
  }


   // login user
 async staffLogin(email: string, password:string){
  const staff = await this.staffRepository.findOne({ where:{email} });
  if (!staff) {
     throw new HttpException("User does not exists", HttpStatus.BAD_REQUEST,);
  }

  const isMatch = await bcrypt.compare(password, staff.password);
  if (!isMatch) {
  throw new HttpException("incorrect password", HttpStatus.BAD_REQUEST);
  }
 }


 async findOne(staffid: string) {
    const staff = await this.staffRepository.findOne({where:{staffid}});
    if (!staff) {
      throw new HttpException("staff does not exist", HttpStatus.NOT_FOUND)
    }
    return staff;
  }

  remove(id: number) {
    return `This action removes a #${id} mystaff`;
  }
}
